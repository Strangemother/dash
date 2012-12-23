from django import forms

class WidgetForm(forms.Form):
    widget_file = forms.FileField(
        label='Upload a widget.'
    )

    active = forms.BooleanField()