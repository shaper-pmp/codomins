//alert("External script running!");
codomins.setContent(document.getElementById('dynamic-element-target-external-dynamic'), 'Success');
if(!window.dynamic_element_target_external_dynamic) {
	window.dynamic_element_target_external_dynamic = true;
}
else {
	alert("Error - window.dynamic_element_target_external_dynamic already exists - this code has somehow been run twice!");
}