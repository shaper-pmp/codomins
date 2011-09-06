#Conditional DOM Insertion#
			
HTML and the web embraces a principle known as device-agnosticism - protocols and markup should (*ideally*) form [interfaces](http://en.wikipedia.org/wiki/Interface_%28object-oriented_programming%29) that hide implementation details of clients from servers and vice-versa.  Device-agnosticism (and by extension, interfaces in general are very important concepts to any computer system, as they allow systems to expand (and entire sections to be replaced) while limiting the changes to the module or section concerned, and without increasing the complexity of the overall system.  One can only imagine how slowly the web would have been developed (if at all!) if we'd all had to upgrade our browsers every time a new server came out, or upgrade our servers every time a new browser hit the market.
			
At its most basic, the web is HTML and HTTP - these are the "universal minima" that any client machine must speak to be able to parse the web. CSS and javascript are useful adjuncts that enable greater flexibility, but - aside from a few edge-cases like widely-supported video embedding, rich client-side interaction like games and the like that are unsupported by HTML alone - the content of a site should be available through the HTML alone, and then [progressively enhanced](http://en.wikipedia.org/wiki/Progressive_enhancement) with more advanced technologies.
			
Following this principle of device-agnosticism, and recognising HTML and an interface between servers and clients (ie, no server-side browser-sniffing), as a web developer the "most correct" way to handle various client devices with varying capabilities accessing a site is to generate/serve the same HTML to them all, then style the site using CSS media types or media queries.

This is great for styling, but as there are no media queries available to javascript it doesn't account for cases where varying *behaviour* is required in addition to varying styling.  For example:
			
* A hover-activated drop-down navigation menu which works fine on a desktop device with a mouse, but which becomes effectively unusable on a touchscreen device (where there is no "hover" event).
* A rich, complex UI widget that works well and improves usability on a desktop machine with plenty of CPU power, memory and screen-space, but which over-taxes a small-screened, limited-CPU, limited-memory mobile device.

* Large, drag-based UIs like Google Maps, which use the same touch-and-drag gesture to scroll the map as mobile devices typically use to scroll the web page the map is embedded in.  Anyone who's found themselves "stranded" in the middle of an embedded Google Map that's larger than their mobile browser's screen, fruitlessly scrolling the map up and down rather than the page it's embedded in will understand the frustration here.

##Existing solutions##
			
There are a variety of existing solutions to the problem of serving different behaviour or styling to different clients:
			
###Serve different HTML to different devices###
			
This has the advantage that each device received only the markup, styling, behaviour and other resources it requires.  However, it also requires server-side browser-sniffing, or even a completely different codebase and a client-side redirect to push appropriate devices to this new site, completely violating the principle of device-agnosticism.  This solution (at <em>best</em>) significantly increase the complexity of server-side code and necessitates re-writing parts it every time a new class of devices comes out, and at worst involves completely forking your theme, templates or entire codebase, and then maintaining two different versions in synchronicity.
			
###Use CSS media types and hide conditional content with CSS (`display:none;`)###
			
This has the advantage that it's typically extremely quick to retrofit to existing sites, and serves the same HTML to all devices.  However it covers only styling; it does not allow for different behaviour on different devices, meaning that less-capable clients are likely to parse and execute all the javascript that a more-capable desktop client will.
			
Even worse, **any linked resources (CSS files, external javascripts, images, etc) in the markup will be downloaded, parsed and rendered as well, only to be thrown away afterwards** when the entire containing element is set to `display:none`!  Although this solution is extremely fast to retrofit to existing sites, that convenience only comes at the cost of a potential waste of bandwidth, parsing and rendering time on the client.
			
###Load conditional content via AJAX###
			
Here we serve the basic content to all devices, then use AJAX calls back to the server to conditionally load additional content, scripts and stylesheets into the page.  On the plus side, the same basic HTML is delivered to all devices (device-agnosticism is still preserved), and the use of javascript allows us to carefully tune each "version" of the page for each type of device; as such devices should almost never download, parse or render any elements, styles or behaviours they don't require.

On the negative side, however, each piece of content requires an additional round-trip to the server *in addition* to any other resource-requests caused by dynamically adding scripts, stylesheets or images to the page.  While additional requests for linked resources like images, stylesheets and scripts might be unavoidable, in the modern world of mobile devices and bandwidth limitations a server round-trip potentially for each piece of conditional content seems somewhat profligate.
			
Even worse, depending on your server-side architecture changing your CMS to load most or all conditional content through AJAX may require significant redesign and redevelopment of both your front-end *and* back-end to allow it, to the point it's simply unrealistic for many legacy sites.

##So what's the new idea?##
			
###In a nutshell###
			
Serve conditional content which may not be required in specially-formatted HTML comments, then use Javascript to conditionally insert them into the DOM on document-ready.
			
###So how does it work?###
			
It almost literally couldn't be simpler to retrofit to an existing site.  You simply add the codomins.js library to the page as a normal external javascript file, call codomins.init() on page-load (eg, using window.onload/$(document).ready), then enclose any conditional content in a specially-formatted comment containing a javascript expression.
			
From this:

    <head>
    </head>
    <body>
      <p>Non-conditional content</p>
      <p>Conditional content</p>
      <p>Non-conditional content</p>
    </body>

To this:
			
    <head>
      <script type="text/javascript" src="codomins.js"></script>
    </head>
    <body onload="codomins.init();">
      <p>Non-conditional content</p>
      <!---[javascript expression]- <p>Conditional content</p> -->
      <p>Non-conditional content</p>
     </body>

If the expression evaluates to true then as soon as the document is loaded the content is extracted from the comment and added to the DOM in the same position as the comment occupied.

So, for example:
			
    <head>
      <script type="text/javascript" src="codomins.js"></script>
    </head>
    <body onload="codomins.init();">
      <p>Non-conditional content</p>
      <!---[document.documentElement.clientWidth < 600]- <p>Conditional content</p> -->
      <p>Non-conditional content</p>
    </body>
			
... would cause the conditional content to only be displayed if the available width of the browser's window was less than 600 pixels.  As the code in the condition expression is executed using eval(), you can use literally any javascript expression or code, as long as it evaluates to boolean true or false in the end.
			
You can even use user-interactive triggers:
			
    <head>
      <script type="text/javascript" src="codomins.js"></script>
    </head>
    <body onload="codomins.init();">
      <p>Non-conditional content</p>
      <!---[confirm("Should we load the conditional content?")]- <p>Conditional content</p> -->
      <p>Non-conditional content</p>
    </body>

... which will load the page, pop up a javascript confirmation ("Yes/No") dialog box and then only load the conditional content if the user clicks "Yes".
			
As you can no doubt imagine, this level of control over markup insertion and external-resource loading is potentially very powerful indeed.
			
###What's the benefit?###
			
This technique has many of the benefits of AJAX-loading - the same basic HTML is served to all devices, elements are not parsed/added to the DOM/rendered unnecessarily, linked resources are not downloaded until needed, etc - but avoids additional unnecessary round-trips to the server to do so.
			
Conditional content inside HTML comments *is* still downloaded, but compared to images, video and the rest of the resources needed to render modern web pages, the unnecessary markup is usually only a tiny fraction of the total weight of a page, and the fact that the same HTML is served to every client makes caching no more difficult or ineffective than with a normal (static) page.  Moreover, **linked resources in HTML comments are not downloaded until the content is inserted into the DOM**, making this a highly efficient technique to defer loading of scripts, stylesheets, images, videos, etc compared to older techniques like hiding undesired markup with CSS.
			
Script tags may also be loaded and executed conditionally in this way; scripts will only be loaded, parsed and executed **when and if they are added to the DOM**, never unnecessarily.  Finally, retrofitting existing sites with this technique is as simple as commenting out conditional content and elements with minimally-formatted comments, making it vastly faster and simpler than either  implementing AJAX callbacks on the server, or forking/modifying the server-side codebase to offer a "mobile version" for sites initially designed without progressive enhancement in mind.
			
Validation does not appear to be a problem, as long as one avoids HTML-comment-closing double-dashes in the conditional content (see `What are the drawbacks?`, below).
			
However, perhaps most importantly of all, this technique is orders of magnitude more easily retrofitted to existing sites than AJAX.  It literally only requires loading an external script and editing your templates to slap comment tags around any conditional content, as opposed to duplication of functionality or even a complete re-engineering of the back-end infrastructure.  As someone increasingly tasked with producing "mobile friendly" versions of legacy sites that were never designed with mobile devices in mind and which typically lack the budget for a complete re-engineering, this seems like a big win.
			
###What are the drawbacks?###
			
In the spirit of full disclosure, I'm not totally sure yet.  This is a new technique and I've only been playing with it for a few days.  However, there will no doubt be a few.

* Be careful of double-dashes ("--").  Double-dashes are used to delimit HTML comments, so including conditional markup that contains double-dashes will break the comment at that point (and will cause the page to fail validation).  This is a common limitation of HTML comments, however, and just requires that double-dashes be escaped or avoided (sadly we can't use CDATA-style comments because Internet Explorer fails to include them in the DOM, making them inaccessible to Javascript).

* Deferring external resources until they're included in the DOM could sometimes lead to [Flash Of Unstyled Content](http://en.wikipedia.org/wiki/Flash_of_unstyled_content) (FOUC) issues if used incorrectly.  However, this can be easily worked around by making conditional content invisible/`display:none` in (non-conditional) CSS, then enabling it in the conditionally-loaded CSS or JS.

* The fact that this is a javascript library means that greater-than-just-HTML support is required of the client to access the conditional content.  This is a technical drawback to the "purity" of the solution, but is a necessary evil (and similarly a "fault" with AJAX and CSS-based solutions).  In addition, there's nothing stopping - in time, if it proved useful - browsers supporting such conditional-loading of content natively, without need for external javascript libraries.

* Others to come?

##Demo / Examples##

A demo/testing page is included in this repository - host `codomins-demo.php` on your server and hit its URL in your web browser.  It will display a page which attempts to conditionally load various types of resources (in-line elemtns, block-level elements, inline/external scripts and CSS, external images, etc), in your browser.

Using the form at the bottom you can also instruct the page to reload itself with a variety of content-types and DOCTYPEs - very useful for testing, as the same browser will often behave wildly differently depending on the content-type and DOCTYPE selected, and it's important to check every combination for bugs/omissions.

New: there's now an on-line version of the demo/testing page at [http://www.shaper-labs.com/projects/codomins/codomins-demo.php](http://www.shaper-labs.com/projects/codomins/codomins-demo.php) for the curious to play with.

##Conclusion##
			
There is no "magic bullet" to making sites (even legacy ones) more mobile-friendly.  However, this technique seems to be a very useful addition to existing techniques like AJAX and hiding elements with CSS.  In particular the ease with which it may be retrofitted to existing sites is potentially extremely useful for making sites more mobile-friendly without incurring huge redevelopment effort.
