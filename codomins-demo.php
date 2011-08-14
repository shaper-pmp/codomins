<?php
  
  /* Simple stub to serve codomins-demo.html with varying content-types/DOCTYPEs for testing purposes. */
  
  $doctypes = array(
	'html4_transitional'	=> '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><html><head>',
	'html4_strict'			=> '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"><html><head>',
	'xhtml1.0_transitional'	=> '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head>',
	'xhtml1.0_strict'		=> '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head>',
	'xhtml1.1'				=> '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head>',
	'xhtmlbasic1.1'			=> '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd"><html><head>',
	'html5'					=> '<!DOCTYPE HTML><html><head>',
  );
  $contenttype = '';
  if(!empty($_REQUEST['content-type']) && preg_match('¬^([a-z0-9_\-\+]+/[a-z0-9_\-\+]+)¬', $_REQUEST['content-type'], $matches)) {
    $contenttype = $matches[1];
  }
  else {
    $contenttype = 'text/html';
  }
  
  header('Content-type: '.$contenttype);

  if(!empty($_REQUEST['doctype']) && preg_match('¬^([a-z0-9_\.]+)¬', $_REQUEST['doctype'], $matches) && array_key_exists($matches[1], $doctypes)) {
   	print($doctypes[$matches[1]]);
  }
  else {
    print($doctypes['html4_transitional']);
  }
  
  print("\n".'<meta http-equiv="content-type" content="'.$contenttype.';charset=UTF-8" />');

  $demopage = file_get_contents('codomins-demo.html');
  print($demopage);
