# Gravel - jQuery popup.

Gravel is a jQuery plugin to give you a popup. It's super lightweight and
requires very little to get it working.

##Requirements.

- jQuery 1.6.3 +

	main framework
	http://jquery.com/

- sprintf.js

	Used for templating of built in HTML
	http://www.diveintojavascript.com/projects/javascript-sprintf

- reveal.js v1.0

	! A required fork of the deprecated plugin can be found here.
	https://github.com/StrangeMother/reveal

Do the usual HTML inclusions.

	<script type="text/javascript" src='jquery.js'></script>
	<link rel="stylesheet" type="text/css" href="reveal.css">
	<script type="text/javascript" src='jquery.reveal.js'></script>
	<script type="text/javascript" src='sprintf.js'></script>
	<script type="text/javascript" src='jquery.gravel.js'></script>

##Goal of the project

I've always found making popups is boring, and I've never enjoyed using full stacks such as jQuery UI.
This lightweight modal plugin is designed to handle modal popups with defaulted options to make it automagically popup-able.

- fade background out
- be modal
- auto closable
- easily implement actions (buttons)

A lot this is handled by the wonderful plugin reveal.js thus we apply

- A close button native to the popup
- popup titles
- popup content
- a very simple clean skin (Google-esque inspired)
- a button framework for easy action mapping
- Super simple API (jQuery plugin or directly accessible)

###Using the plugin.


####Getting Started - http://jsfiddle.net/Glycerine/bjpdm/
To get started you can do the simplest:


	<div id='simple'>This is some basic text information.</div>
<div></div>
	$('#simple').gravel()

####Using a Title - http://jsfiddle.net/Glycerine/bjpdm/1/

You can add options to your simple popup such as a title.

	$('#simple').gravel('My Title')


####Auto titles - http://jsfiddle.net/Glycerine/bjpdm/2/

If you have a h2.title element within your content gravel will use this and remove it from the main content block.

	<div id="simpleTitle">
	    <h2 class="title">Another Title</h2>
	    This popup is on Gravel. Isn't it easy!
	</div>
<div></div>
	$('#simpleTitle').gravel();

####Overriding Auto Titles - http://jsfiddle.net/Glycerine/bjpdm/3/
You can override the auto title by giving another like before!:

	$('#simpleTitle').gravel('My title');


####Popup without $elector wrapping - http://jsfiddle.net/Glycerine/bjpdm/4/

You can use gravel outside the context of jquery. This eliminates the need to
wrap an existing object and allows you to push custom popups.

	gravel('My Title', 'I have something to say about this Sir!');

###Gravel object.

You can do perform more tricks to gravel by receiving the returned Gravel object.

	var _gravels = $('#simpleTitle').gravel();
	console.log(_gravels); // Array of Gravel

If you're using the method call, you'll receive a single gravel

	var _gravel = gravel('title', 'text');
	console.log(_gravel); // A single Gravel

####Gravel API

You can use this as an example object:

<div></div>

	_gravel = gravel('hi there', 'some other info')


- <strong>Gravel[0]</strong> - Receive the HTML element currently used on the page.

<div></div>

	>>> _gravel[0]
	[<div class="reveal-modal gravel-popup" id="gStyle_popup" data-animation="fade" style="top: 100px; opacity: 1; visibility: visible; ">]


- <strong>Gravel.element</strong> - Recieve the HTML template used for the HTML element created.

<div></div>

	>>> _gravel.element
	// Returns text template in HTML format.


- <strong>Gravel.renderedHtml()</strong> - Receive the rendered HTML, ready to add to the DOM

<div></div>

	>>> _gravel.renderedHtml();
	'<div> ... truncated .. </div>' // a string of valid HTML


- <strong>Gravel.title(<em>string</em>)</strong> - Get and Set the title of popup. Returns a string if the title value is not set. Returns a Gravel object if a new title string is passed. This is immediately rendered.

<div></div>

	>>> _gravel.title();
	'title'

<div></div>

	>>> _gravel.title('flubber');
	<Gravel> //Returns Gravel object


- <strong>Gravel.text(<em>string</em>)</strong> - Get and Set the main body of information. Returns a string if the text value is not set. Returns a Gravel object if a new text string is passed. This is immediately rendered.

<div></div>

	>>> _gravel.text();
	'... text'

<div></div>

	>>> _gravel.text('wibble');
	<Gravel> //Returns Gravel object


- <strong>Gravel.onOpen</strong> - Handler for when the popup is open

<div></div>

	>>> _gravel.onOpen = function(){
		console.log("openHandler callback");
	}


- <strong>Gravel.onClose</strong> - Handler for when the popup is closed

<div></div>

	>>> _gravel.onClose = function(){
		console.log("closeHandler callback");
	}


- <strong>Gravel.buttons()</strong> - Receive an array of PopupButton's used within the Gravel popup. You can collect a single button object by passing a reference to it.

<div></div>

	>>> _gravel.buttons();
	[ PopupButton ] //returns array of buttons

	>>> _gravel.buttons('okay')
	PopupButton // returns the button or null

- <strong>Gravel.addButton(<em>string | object | PopupButton</em>)</strong> - Add a button to the popup, allowing to custom interactions.

the easiest method it to simply pass a string. The string becomes an active button. Without mapping any functionality to the button, it would simply close the popup.
Some button words have some color mapping. Making it easier to create a cleaner UI.
All buttons added to Gravel will become an object of PopupButton. This object wraps the functionality and color of the button - making it wasy to manipulate them.

<div></div>
	>>> _gravel.addButton('close')
	[ PopupButton ]

	>>> _gravel.addButton
In this example you'll notice the close button is a different color and is instantly a close button.

