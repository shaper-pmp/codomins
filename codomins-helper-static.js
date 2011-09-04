//alert("External script running!");
codomins.setContent(document.getElementById('dynamic-element-target-external-static'), 'Success');
if(!window.dynamic_element_target_external_static) {
	window.dynamic_element_target_external_static = true;
}
else {
  alert("Error - window.dynamic_element_target_external_static already exists - this code has somehow been run twice!");
}