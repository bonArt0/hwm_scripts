﻿// ==UserScript==
// @name          HWM arts hard
// @description   Текущая прочность (2016.10.05)
// @namespace     перф (add ElMarado)
// @version       1.51
// @encoding 	  utf-8
// @include       http://*.heroeswm.ru/home.php
// @include       http://*.heroeswm.ru/pl_info.php?*
// @include       http://*.heroeswm.ru/inventory.php*
// @include       http://*.heroeswm.ru/sklad_info.php?*
// @include       http://*.heroeswm.ru/arts_arenda.php
// @include       http://178.248.235.15/home.php
// @include       http://178.248.235.15/pl_info.php?*
// @include       http://178.248.235.15/inventory.php*
// @include       http://178.248.235.15/sklad_info.php?*
// @include       http://178.248.235.15/arts_arenda.php
// @include       http://www.lordswm.com/home.php
// @include       http://www.lordswm.com/pl_info.php?*
// @include       http://www.lordswm.com/inventory.php*
// @include       http://www.lordswm.com/sklad_info.php?*
// @include       http://www.lordswm.com/arts_arenda.php

// ==/UserScript==
var url = location.href ;
var min_Strength = 2; //прочка начиная с которой подкрашиваем в красный цвет.
var item_hard_regexp = /: (\d+)\/(\d+)/;
var item_name_regexp = /uid=(\d+)/
var text_new_begin =  '<div style="color: #000000; font-size: 9px; padding: 0px; border-color: #eecd59; border-width: 0px; border-style: solid; margin-top: 1px; margin-left: 2px; background-color: #E0C898; position: absolute">';
var text_new_begin5 = '<div style="color: #FF0000; font-size: 9px; padding: 0px; border-color: #eecd59; border-width: 0px; border-style: solid; margin-top: 1px; margin-left: 2px; background-color: #E0C898; position: absolute">';
var text_new_end = '</div>';

if (url.indexOf('pl_info.php') >= 0)
	HardBySlot();

if(url.indexOf('home.php') >= 0)
	HardByInfo();

if(url.indexOf('arts_arenda.php') >= 0)
	HardByInfo();

if(url.indexOf('sklad_info.php') >= 0)
	HardByInfo();

if(url.indexOf('inventory.php') >= 0) {
		HardBySlot();
		HardByInfo();
	if((typeof arts_c) != 'undefined') {
		// FF4+, Opera
		HardByJS();
	}
	else {
		// FF3-, Chrome
		// HardByDocument();
		document.body.setAttribute('onload',
				' function getI(xpath,elem){return document.evaluate(xpath,(!elem?document:elem),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}; '+
				' var text_new_begin = \'<div style="color: #000000; font-size: 9px; padding: 0px; border-color: \#eecd59; border-width: 0px; border-style: solid; margin-top: 1px; margin-left: 4px; background-color: \#E0C898; position: absolute">\';'+
				' var text_new_end = \'</div>\'; '+
				' var item_hard_regexp = /: (\\d+)\\/(\\d+)/; '+
				' var dreses = getI( "//div[contains(@id, \'slot\')]" ); '+
				' for( var i = 0; i < dreses.snapshotLength; i++ ) { '+
				'		var dress = dreses.snapshotItem(i); '+
				'		var hard = item_hard_regexp.exec(dress.innerHTML); '+
				'		if(hard) '+
				'			dress.innerHTML = text_new_begin + String(hard[1]+'/'+hard[2]) + text_new_end + dress.innerHTML; '+
				'	} '+
				'	for(var i = 0; i < arts_c; i++) { '+
				'		if(arts_fd_none[i]) { '+
				'                       if(arts_id[i]) {arts1[i]= \'<i style="font-size:10px">&nbsp;&nbsp;ID:\'+  arts_id[i] + \'</i>\' + arts1[i]};'+
				'			hard = item_hard_regexp.exec(arts_fd_none[i]); '+
				'			if(hard){ '+
				'				if(arts_fud[i]) { '+
				'					arts_fud[i]     = text_new_begin + String(hard[1])+\'/\'+ String(hard[2]) + text_new_end + arts_fud[i]; '+
				'				} '+
				'				if(arts_fd_ok[i]) { '+
				'					arts_fd_ok[i]   = text_new_begin + String(hard[1])+\'/\'+ String(hard[2]) + text_new_end + arts_fd_ok[i]; '+
				'				} '+
				'				if(arts_fd_none[i]) { '+
				'					arts_fd_none[i] = text_new_begin + String(hard[1])+\'/\'+ String(hard[2]) + text_new_end + arts_fd_none[i]; '+
				'				} '+
				'			} '+
				'		}	'+
				'	} '+
				'	show_c(); '+
				' ');
	}
}

function HardBySlot() {
	var dreses = getI( "//div[contains(@id, 'slot')]" );
	for( var i = 0; i < dreses.snapshotLength; i++ ) {
		var dress =  dreses.snapshotItem(i);
		hard = item_hard_regexp.exec(dress.innerHTML);
		if(hard)
			dress.innerHTML = hardHTML(hard) + dress.innerHTML;
	}
}

function HardByInfo() {
	var dreses = getI( "//a[contains(@href, 'art_info.php?id=')]" );
	var elo = '' ;
	for( var i = 0; i < dreses.snapshotLength; i++ ) {
		var dress =  dreses.snapshotItem(i);

		an = item_name_regexp.exec( dress.href ) ;
		if( an )
		{
			if( elo == an[1] )
				continue
			else
				elo = an[1]
		}
		hard = item_hard_regexp.exec(dress.parentNode.innerHTML);
		if(hard)
			dress.parentNode.innerHTML = hardHTML(hard) + dress.parentNode.innerHTML;
	}
}

function HardByJS() {
	for(var i = 0; i < arts_c; i++) {
		if(arts_fd_none[i]) {
			hard = item_hard_regexp.exec(arts_fd_none[i]);
//			alert (arts_id[i]);
                        if(arts_id[i]) {arts1[i]= '<i style="font-size:10px">&nbsp;&nbsp;ID:'+  arts_id[i] + '</i>' + arts1[i]};
			if(hard){
				if(arts_fud[i]) {
					arts_fud[i] = hardHTML(hard) + arts_fud[i];
				}
				if(arts_fd_ok[i]) {
					arts_fd_ok[i] = hardHTML(hard) + arts_fd_ok[i];
				}
				if(arts_fd_none[i]) {
					arts_fd_none[i] = hardHTML(hard) + arts_fd_none[i];
				}
			}
		}	
	}
	show_c();
}

function HardByDocument() {
	var text = String(document.documentElement.innerHTML);
	alert(text);
	var pos = 0;
	var pos_id = 0;
	var pos_begin = 0;
	var pos_end = 0;
	while(true) {
		pos_id = text.indexOf('/i/artifacts/', pos);
		if(pos_id < 0)
			break;
		if(text.charAt(pos_id - 1) == 'c') { 
			/*<img border="0" title="............" src=""http://....*/
			pos_begin = text.lastIndexOf('<img', pos_id );
			pos_end = pos_id;
		}
		else {
			/*<table border="0" cellpadding="0" cellspacing="0" background=....*/
			pos_begin = text.lastIndexOf('<table', pos_id );
			pos_end = text.indexOf('</a>', pos_id );
		}
		hard = item_hard_regexp.exec(text.substring(pos_begin, pos_end));
		if(hard) {
			text = text.substring(0, pos_begin) + hardHTML(hard) + text.substring(pos_begin);
		}
		pos = pos_end + text_new_begin.length + text_new_end.length + 5;
	}
	document.documentElement.innerHTML = text;
}

function getI(xpath,elem){return document.evaluate(xpath,(!elem?document:elem),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}

function hardHTML(hard1){
	if ( hard1[1] > min_Strength)      { return text_new_begin  + String(hard1[1]) + '/' + String(hard1[2]) + text_new_end; } 
					else { return text_new_begin5 + String(hard1[1]) + '/' + String(hard1[2]) + text_new_end; }
}