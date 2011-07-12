<?php
  
  /* Simple stub to serve codomins-demo.html with varying content-types/DOCTYPEs for testing purposes. */
  
  $doctypes = array(
	'html4_transitional'	=> '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><html>',
	'html4_strict'			=> '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"><html>',
	'xhtml1.0_transitional'	=> '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml">',
	'xhtml1.0_strict'		=> '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml">',
	'xhtml1.1'				=> '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"><html xmlns="http://www.w3.org/1999/xhtml">',
	'xhtmlbasic1.1'			=> '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd"><html>',
	'html5'					=> '<!DOCTYPE HTML><html>',
  );
  if(!empty($_REQUEST['content-type']) && preg_match('¬^([a-z0-9_\-\+]+/[a-z0-9_\-\+]+)¬', $_REQUEST['content-type'], $matches)) {
    header('Content-type: '.$matches[1]);
  }
  if(!empty($_REQUEST['doctype']) && preg_match('¬^([a-z0-9_\.]+)¬', $_REQUEST['doctype'], $matches)) {
  	if(array_key_exists($matches[1], $doctypes)) {
	  	print($doctypes[$matches[1]]);
	  }
  }

  $demopage = file_get_contents('codomins-demo.html');
  print($demopage);
