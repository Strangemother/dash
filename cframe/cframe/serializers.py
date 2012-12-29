from io import StringIO

try:

    from django.db.models import Model
    from django.db.models.query import QuerySet
    from django.utils.encoding import smart_unicode
    from django.utils.simplejson import dumps
    from django.utils import simplejson
    from datetime import datetime, date
    from django.http import HttpResponse
except ImportError:
    django_lib = False
else:
    django_lib = True
    # no django

class Error(Exception):
    ''' Base class for exceptions in this module'''
    pass

class NoDjangoError(Error):
    '''Exception raised for missing django modules'''
    def __init__(self, value):
        self.value = value

"""
from serializers import to_json(data, **options)
"""

def model_json(queryset, fields_tuple=None):
    if django_lib:
        from django.core import serializers as srl
        return srl.serialize('json', queryset, fields=fields_tuple)
    else:
        raise NoDjangoError('''Cannot use django.core.serializers as Django is
                            not installed.''')

def model_json_response(queryset, fields_tuple=None):
    data = model_json(queryset, fields_tuple)
    return HttpResponse(
            data,
            content_type = 'application/javascript; charset=utf8'
        )

def json_response(something):
    '''return Simple json dumps() wrapped by a django HttpResponse'''
    o = []
    o.append(something)
    return HttpResponse(
        simplejson.dumps(o),
        content_type = 'application/javascript; charset=utf8'
    )

def json_serialize(object, *args, **kwargs):
    ''' Evoke the serializer '''
    js = JSONSerializer()
    j = js.serialize(object, *args, **kwargs)

    return j

def json_serialize_response(object, *args, **kwargs):
    ''' Eveoke the serializer and return a django HttpResponse'''
    r = json_serialize(object, *args, **kwargs)
    return HttpResponse(r, mimetype='application/json')

def to_json(data, **options):
    ''' Convery the data to JSON
    return is JSON'''
    js = JSONSerializer()
    j = js.serialize(object, options)

    return j

class UnableToSerializeError(Exception):
    """ Error for not implemented classes """
    def __init__(self, value):
        self.value = value
        Exception.__init__(self)

    def __str__(self):
        return repr(self.value)

'''
If there are fields requiring serialization,
pass a list of SerializeEntities to
'''
class SerializeEntity():

    def __init__(self, search, replacement):
        self.needle = search
        self.replacement = replacement

    def __unicode__(self):
        return u'%s' % self.needle


class JSONSerializer():
    boolean_fields = ['BooleanField', 'NullBooleanField']
    datetime_fields = ['DatetimeField', 'DateField', 'TimeField']
    number_fields = ['IntegerField', 'AutoField', 'DecimalField', 'FloatField', 'PositiveSmallIntegerField']

    def serialize(self, obj, *args, **options):
        self.options = options

        self.stream = options.pop("stream", StringIO())
        self.selectedFields = options.pop("fields", options.get('fields', None))
        self.ignoredFields = options.pop("ignored", options.get('ignored', None))
        self.use_natural_keys = options.pop("use_natural_keys", options.get("use_natural_keys", False))
        self.transcript = options.pop("transcript", options.get("transcript", {}))
        self.currentLoc = ''

        self.level = 0

        self.start_serialization()

        self.handle_object(obj)

        self.end_serialization()
        return self.getvalue()

    def get_string_value(self, obj, field):
        """Convert a field's value to a string."""
        return smart_unicode(field.value_to_string(obj))

    def start_serialization(self):
        """Called when serializing of the queryset starts."""
        pass

    def end_serialization(self):
        """Called when serializing of the queryset ends."""
        pass

    def start_array(self):
        """Called when serializing of an array starts."""
        self.stream.write(u'[')
    def end_array(self):
        """Called when serializing of an array ends."""
        self.stream.write(u']')

    def start_object(self):
        """Called when serializing of an object starts."""
        self.stream.write(u'{')

    def end_object(self):
        """Called when serializing of an object ends."""
        self.stream.write(u'}')

    def handle_object(self, object):
        """ Called to handle everything, looks for the correct handling """
        if isinstance(object, dict):
            self.handle_dictionary(object)

        elif isinstance(object, list):
            self.handle_list(object)

        elif isinstance(object, Model):
            self.handle_model(object)

        elif isinstance(object, QuerySet):
            self.handle_queryset(object)

        elif isinstance(object, bool):
            self.handle_simple(object)

        elif isinstance(object, int) or isinstance(object, float) or isinstance(object, long):
            self.handle_simple(object)

        elif isinstance(object, unicode):
            self.handle_simple(object)

        elif isinstance(object, basestring):
            self.handle_simple(object)

        elif isinstance(object, datetime):
            self.handle_datetime(object)

        elif isinstance(object, date):
            self.handle_date(object)

        elif object == None:
            self.handle_none(object)
        else:
            # If this a seralize entity
            try:
                self.handle_string(object)
            except:
                raise UnableToSerializeError(type(object))

    def handle_dictionary(self, d):
        """Called to handle a Dictionary"""
        i = 0
        self.start_object()
        for key, value in d.iteritems():
            self.currentLoc += key+'.'
            #self.stream.write(unicode(self.currentLoc))
            i += 1
            self.handle_simple(key)
            self.stream.write(u': ')
            self.handle_object(value)
            if i != len(d):
                self.stream.write(u', ')
            self.currentLoc = self.currentLoc[0:(len(self.currentLoc)-len(key)-1)]
        self.end_object()

    def handle_list(self, l):
        """Called to handle a list"""
        self.start_array()

        for value in l:
            self.handle_object(value)
            if l.index(value) != len(l) -1:
                self.stream.write(u', ')

        self.end_array()

    def handle_datetime(self, d):

        self.start_object()
        self.stream.write(u'"date" : "%s", ' % str(d))
        self.stream.write(u'"day" : "%s", ' % d.day )
        self.stream.write(u'"hour" : "%s", ' % d.hour)
        self.stream.write(u'"microsecond" : "%s", ' % d.microsecond )
        self.stream.write(u'"minute" : "%s", ' % d.minute )
        self.stream.write(u'"month" : "%s", ' % d.month)
        self.stream.write(u'"second" : "%s", ' % d.second)
        self.stream.write(u'"weekday" : "%s", ' % d.weekday())
        self.stream.write(u'"year" : "%s"' % d.year )

        self.end_object()

    def handle_date(self, d):

        self.start_object()
        self.stream.write(u'"day" : %s, ' % d.day )
        self.stream.write(u'"month" : %s, ' % d.month)
        self.stream.write(u'"year" : %s,' % d.year )
        self.stream.write(u'"weekday" : %s, ' % d.weekday())
        self.stream.write(u'"isoformat" : "%s", ' % d.isoformat())
        self.stream.write(u'"ctime" : "%s"' % d.ctime())

        self.end_object()



    def handle_model(self, mod):
        """Called to handle a django Model"""

        try:
            _meta = mod._meta
        except AttributeError as e:
             _meta = None

        if _meta is None:
            # Try a standard object
            self.handle_simple(mod)
        else:
            self.start_object()
            for field in mod._meta.local_fields:
                if field.rel is None:
                    if self.selectedFields is None or field.attname in self.selectedFields or field.attname:
                        if self.ignoredFields is None or self.currentLoc + field.attname not in self.ignoredFields:
                            self.handle_field(mod, field)
                else:
                    if self.selectedFields is None or field.attname[:-3] in self.selectedFields:
                        if self.ignoredFields is None or self.currentLoc + field.attname[:-3] not in self.ignoredFields:
                            self.handle_fk_field(mod, field)
            for field in mod._meta.many_to_many:
                if self.selectedFields is None or field.attname in self.selectedFields:
                    if self.ignoredFields is None or self.currentLoc + field.attname not in self.ignoredFields:
                        self.handle_m2m_field(mod, field)
            self.stream.seek(self.stream.tell()-2)
            self.end_object()

    def handle_queryset(self, queryset):
        """Called to handle a django queryset"""
        self.start_array()
        it = 0
        for mod in queryset:
            it += 1
            self.handle_model(mod)
            if queryset.count() != it:
                self.stream.write(u', ')
        self.end_array()

    def handle_field(self, mod, field):
        """Called to handle each individual (non-relational) field on an object."""
        self.handle_simple(field.name)
        if field.get_internal_type() in self.boolean_fields:
            if field.value_to_string(mod) == 'True':
                self.stream.write(u': true')
            elif field.value_to_string(mod) == 'False':
                self.stream.write(u': false')
            else:
                self.stream.write(u': undefined')
        else:
            self.stream.write(u': ')
            self.handle_simple(field.value_to_string(mod))
        self.stream.write(u', ')

    def handle_fk_field(self, mod, field):
        """Called to handle a ForeignKey field."""
        related = getattr(mod, field.name)
        if related is not None:
            if field.rel.field_name == related._meta.pk.name:
                # Related to remote object via primary key
                pk = related._get_pk_val()
            else:

                if hasattr(mod, '_meta'):
                    so= {}
                    for x in mod.__dict__:
                        if x not in ['_state']:
                            so[x] = mod.__dict__[x]
                    self.handle_object(so)
                else:
                    self.handle_simple(mod)

                self.stream.write(u': ')
                self.handle_object(d)
                self.stream.write(u', ')



    def handle_m2m_field(self, mod, field):
        """Called to handle a ManyToManyField.
        BUG:
        Mixes previous calls to this...

        Itterates over the same object in the wrong list...
        """

        if field.rel.through._meta.auto_created:
            self.handle_simple(field.name)
            self.stream.write(u': ')
            self.start_array()
            hasRelationships = False


            if hasRelationships:
                self.stream.seek(self.stream.tell()-2)

            for relobj in getattr(mod, field.name).iterator():
                hasRelationships = True
                # This writes the same object to the tree
                # each time. Replication mod._meta every time.

                self.handle_object(relobj)
                self.stream.write(u', ')

            if hasRelationships:
                self.stream.seek(self.stream.tell()-2)
            self.end_array()
            self.stream.write(u', ')

    def handle_simple(self, simple):
        """ Called to handle values that can be handled via simplejson """
        self.stream.write(unicode(dumps(simple)))

    def handle_string(self, simple):
        self.stream.write( u'"%s"' % str(simple))

    def handle_none(self, object):
        o = u'null'
        self.stream.write(o)#unicode(dumps(o)))

    def getvalue(self):
        """Return the fully serialized object (or None if the output stream is  not seekable).sss """
        if callable(getattr(self.stream, 'getvalue', None)):
            return self.stream.getvalue()
