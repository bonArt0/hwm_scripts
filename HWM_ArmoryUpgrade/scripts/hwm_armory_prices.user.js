// ==UserScript==
// @name	uni_hwm_sklad
// @description Warehouse Tools (2017.06.01)
// @author	ElMarado
// @version	2.23
// @include	http://*.heroeswm.ru/house_info.php*
// @include	http://*.heroeswm.ru/sklad_info.php*
// @include	http://*.heroeswm.ru/inventory.php*
// @include	http://178.248.235.15/house_info.php*
// @include	http://178.248.235.15/sklad_info.php*
// @include	http://178.248.235.15/inventory.php*
// @resource	sklad file:///C:/sklad.txt 
// @require	http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant       GM_getResourceText
// @icon        https://app.box.com/representation/file_version_34029013909/image_2048/1.png?shared_name=hz97b2qwo2ycc5ospb7ccffn13w3ehc4
// @namespace	https://greasyfork.org/users/14188
// ==/UserScript==
var version = '2.23';
var stavka_kuzni = 103;
var k_price=1;  				// коэффициент стоимости артов. 1 - 100%, 0.5 - 50%, и т.д.
var make_report = 0;                            // (new) создавать отчет по прочке артов
var inv_verify = 0;				// (new) проверять инвентарь на наличие уникальных артов отсутсвующих в базе данных(в файле)
var house_verify = 0;				// (new) проверять трофейный зал дома на наличие уникальных артов отсутсвующих в базе данных(в файле)
var s_report = '';
var s_exp = '';
var price_rem = TMP_PRICES_ARRAYS.price_rem;

var url_cur  = location.href;
var url_sklad  = "sklad_info.php";
var all_tables = document.getElementsByTagName('table');

//****************************************************

//******* считывание цены арта из файла ************
function get_price(art) {
var database = GM_getResourceText("sklad");
var i, artPos, pricePos, endPos, price, str_art;
	str_art = ' '+art+':';
	artPos = database.indexOf(str_art.toString());
	if (artPos != -1) {
	        for (i = artPos; i < database.length; i++) {
	            	if (database[i] == ':') {
				pricePos=i+1; 
				break;
			}
		}
	        for (i = pricePos; i < database.length; i++) {
	            	if (database[i] == ';') {
				endPos=i; 
				break;
			}
		}
		price = database.substring(pricePos,endPos).trim();
		return price.valueOf();
	} else {
		return -1;
	}
};
//****** считывание стоимости ремонта арта из базы *****
function get_price_rem(art) {
  if (price_rem[art] != null) {
	return price_rem[art];
  } else {
//	alert(ustring('В базе не найден: ')+art+ustring('. Внесите его в базу(в файл скрипта) с указанем цены ремонта.'));
	return [0,0];
  }
};
//****** сравниваем цены арта по факту и из файла ******
//(а также заполняем цену, цвета переданного el_price и текст переданного el_text -_-)
function compare_price(el_price, el_text, prc_art, prc_cur) {
	el_price.childNodes[0].setAttribute('value',Math.ceil(prc_art*k_price));
	if (prc_cur == Math.ceil(prc_art*k_price)) {					//если цены совпадают
		el_price.setAttribute('bgcolor',"#88FF99");	  			//фон делаем зеленым
	} else {                                                                	//если цены НЕ совпадают
		el_price.setAttribute('bgcolor',"#FFBBCC");	  			//фон делаем розовым
		el_text.innerHTML += '<font style="font-size:10px;color:#000000;">'+' ( <b>'+ustring('Цена по базе: <font style="font-size:12px; color:#FF3344;">')+prc_art+'</b></font>,';
		el_text.innerHTML += '<font style="font-size:10px;color:#000000;">'+' <b>'+ustring('Текущая цена: <font style="font-size:12px; color:#FF3344;">')+prc_cur+'</b></font> )';
	}
	return;
}
//****** формирование отчёта по прочке артов *******
// не понятно, что делает
function add2report (uId, pr_cur, pr_max) {
	if (make_report == 1) {
		uId = uId.substring(uId.lastIndexOf("=")+1,uId.length);
		if (uId.length > 0) {
			if (s_report.length > 0) {s_report += '\n';}
			s_report +=uId+' '+pr_cur+' '+pr_max;
		}
	}
	return;
}
//****** формирование отчета по отсутсвующему в файле арту ****
// неявно принимает и отдаёт s_exp
function add2export (name, uId, price) {
	if (s_exp.length > 0) {s_exp += '\n';}
	s_exp += name+' '+uId+': '+price+';';
	s_exp = s_exp.replace('  ',' ');
	return;
}
//****************************************************
function sklad_info() {
	var ss, s3, ems, ems2, ems3, elem, elem2, elem3, elem4, pos, single, pos_write;
	var title, art_type, art_url, prochka_cur, prochka_max, prochka, cur_price, price_art, cena_rem, list, ss_kompl, art_klass, uID, sum_price, name_art;
	var edit_mode = 0;
	var newgosart = false;
//******** Определяем режим склада ***********
	ems = document.querySelectorAll( "td > a[href*='sklad_rc_on']")
	if (ems.length != 0) {
		elem = ems[0].href;                                                                                                     //edit_mode 1 - режим редактирования
		elem2 = elem.substring(elem.length-1,elem.length);
		edit_mode = 1 - elem2; 
//		elem2 = ems[0].parentNode.parentNode.children[0].children[2].children[0].innerHTML;                                     // для версии мультискладов
//		sklad = "_"+elem2.substring(1,elem2.length);                                                                            // для версии мультискладов
	}
        if (edit_mode == 0) {   													//Если включен режим редактирования
		ems = document.querySelectorAll( "td > select[name*='repair_p']"); 							//Ищем поле с процентной ставкой
                if (ems.length != 0) {
			stavka_kuzni = ems[0].selectedIndex+100; 
		}															// процентная ставка кузнецов 10х%
	}
//******** Обработка вкладок Оружие, броня, ювелирка ********************
	if ((document.location.href.indexOf('cat=3') == -1) && (document.location.href.indexOf('cat=4') == -1) && (document.location.href.indexOf('cat=5') == -1)){
		for (var k = 0; k < all_tables.length; k++)
		{
			if (all_tables[k].className == "wb")  
			{
				ems = all_tables[k].querySelectorAll( "table [cellspacing *='1']"); 
				for (var i = 0; i < ems.length; i++) {
					if (ems[i].parentNode.className == "wbwhite"){
// ************* Обработка уникальных артов ****************************
                       	                        ems2 = ems[i].childNodes[0].querySelectorAll( "table [background*='/i/artifacts']");
						for (var j = 0; j < ems2.length; j++) {
                                                        art_url = ems2[j].getAttribute('background');          					//ссылка на картинку арта
							art_type = art_url.substring(art_url.lastIndexOf("/")+1,art_url.lastIndexOf(".")-2); 	//название арта
							cena_rem = get_price_rem(art_type)[1];
							elem = ems2[j].parentNode.parentNode.childNodes[1].childNodes[0]; 			//Это элемент описания. Можно править.
							elem2 = elem.innerHTML;
							name_art = elem2.substring(1,elem2.lastIndexOf("'"));
                                                        prochka = elem2.substring(elem2.lastIndexOf("[")+1,elem2.lastIndexOf("]"));    		//прочка в формате хх/уу
							prochka_cur = prochka.substring(0,prochka.lastIndexOf("/"));                		//текущая прочка
							prochka_max = prochka.substring(prochka.lastIndexOf("/")+1,prochka.length); 		//макс.прочка
							ss = Math.ceil(cena_rem*stavka_kuzni/100/Math.floor(prochka_max*0.9));			//Себестоимость ремонта за 1 бой
							s3 = Math.ceil(cena_rem*stavka_kuzni/100/Math.floor(prochka_max*0.9-3));		//Себестоимость ремонта через 3 круга
                                                        if (edit_mode == 0) {   //Если включен обычный режим
                                                                ems3 = ems2[j].parentNode.parentNode.querySelectorAll( "td [width*='80']"); 	//Ищем поле с ценой
								if (ems3.length == 0) { 
//									alert('Field with price not found.');
								} else {
									cur_price = ems3[0].childNodes[0].innerHTML;                       	//Цена аренды
								}
							} else {                                                				//Если включен режим редактирования
                                                                ems3 = ems2[j].parentNode.parentNode.querySelectorAll( "td > input[name*='bcost']"); //Ищем поле с ценой
								cur_price = ems3[0].getAttribute('value');                                 	//Цена аренды
                                                                elem.innerHTML += '<br><font style="color:#0132CC;">'+'<b>'+ustring('Себестоимость след.ремонта: <font style="font-size:12px; color:#0132CC;">')+ss+'</b></font>';
								elem3 = ems2[j].childNodes[0].childNodes[0].childNodes[0].childNodes[0];
                                                                if (elem3.tagName == "TABLE") {elem3 = elem3.childNodes[0].childNodes[0].childNodes[0].childNodes[0];} // Если трофеи.
								uID = elem3.href.substring(elem3.href.lastIndexOf("?id=")+4,elem3.href.length);  //uid уникальных артов
/* +add+ */							if (uID.indexOf("&crc") != -1) uID = uID.substring(0,uID.indexOf("&crc"));
	                                                        price_art = get_price(uID);                                                     //цена в базе для этого арта
                                                                if (price_art != -1) {                                                          //если арт есть в базе
									compare_price(ems3[i].parentNode, elem, price_art, cur_price);          //Сранение цен и закраска
								} else { 									//если арта нет в базе
									add2export(name_art,uID,cur_price);
								}
								add2report(uID,prochka_cur,prochka_max);
							}
							if (cur_price < s3) {
								ems2[j].parentNode.setAttribute('bgcolor',"#30D5C8");  				//бирюзовая рамочка
								ems2[j].setAttribute('style',"margin: 2px");           				//бирюзовая рамочка
							}
							if (cur_price < ss) {
								ems2[j].parentNode.setAttribute('bgcolor',"#FF4444");  				//красная рамочка
							}
						}
// ************* Конец обработка уникальных артов, начало обработки обычных артов ****************************
                       	                        ems2 = ems[i].childNodes[0].querySelectorAll( "td > a[href*='art_info.php?id=']");
						for (var j = 0; j < ems2.length; j++) {
                                                        if (ems2[j].href.search(/uid/) == -1)
							{
        	                                                art_url = ems2[j].href;						          	//ссылка на картинку арта
								art_type = art_url.substring(art_url.lastIndexOf("=")+1,art_url.length); 	//название арта
								cena_rem = get_price_rem(art_type)[1];
        	                                                art_klass = get_price_rem(art_type)[0];
								elem = ems2[j].parentNode.parentNode.childNodes[1].childNodes[0]; 		//Это элемент описания. Можно править.
								elem2 = elem.innerHTML;
								name_art = elem2.substring(1,elem2.lastIndexOf("'"));
	                                                        prochka = elem2.substring(elem2.lastIndexOf("[")+1,elem2.lastIndexOf("]"));	//прочка в формате хх/уу
								prochka_cur = prochka.substring(0,prochka.lastIndexOf("/"));                	//текущая прочка
								prochka_max = prochka.substring(prochka.lastIndexOf("/")+1,prochka.length);	//макс.прочка
								if ((art_klass >0 && art_klass<10) && (prochka_max > 49) && ((prochka_max % 5) == 0) ) { //Если это госарт, то ..
									newgosart = true;
								} else {
									ss = Math.ceil(cena_rem*stavka_kuzni/100/Math.floor(prochka_max*0.9));	//Себестоимость ремонта
								}
                                                                if (art_klass >0 && art_klass<10) {                                              //Если это госарт, то ..
									s3 = Math.ceil(cena_rem*stavka_kuzni/100/Math.floor(prochka_max*0.9-1));//Себестоимость ремонта через 1 круг
								} else {
									s3 = Math.ceil(cena_rem*stavka_kuzni/100/Math.floor(prochka_max*0.9-3));//Себестоимость ремонта через 3 круга
								}
// **************************** обработка полученных данных
 	                                                        if (edit_mode == 0) {   //Если включен обычный режим
        	                                                        ems3 = ems2[j].parentNode.parentNode.querySelectorAll( "td [width*='80']"); //Ищем поле с ценой
									if (ems3.length == 0) { 
//										alert('Field with price not found.');
									} else {
										cur_price = ems3[0].childNodes[0].innerHTML;			//Цена аренды
									}
								} else {                                                			//Если включен режим редактирования
	                                                                ems3 = ems2[j].parentNode.parentNode.querySelectorAll( "td > input[name*='bcost']"); //Ищем поле с ценой
									cur_price = ems3[0].getAttribute('value');                              //Цена аренды
                        	                                        if (newgosart) {
										elem.innerHTML += '<br><font style="color:#0132CC;">'+'<b>'+ustring('Себестоимость 1 боя: <font style="font-size:11px; color:#0132CC;">') + Math.ceil(cena_rem*20/19/prochka_max) +'('+Math.floor(Math.ceil(cena_rem*20/19)*97/(100*prochka_max))+')</b></font>';
										newgosart = false;
										ss = Math.ceil(Math.ceil(cena_rem*stavka_kuzni/100)/Math.floor(prochka_max*0.9)); //Себестоимость 1 боя следующего ремонта
									}
									elem.innerHTML += '<br><font style="color:#0132CC;">'+'<b>'+ustring('Себестоимость след.ремонта: <font style="font-size:12px; color:#0132CC;">')+ss+'</b></font>';
									elem3 = ems2[j];
									uID = elem3.href.substring(elem3.href.lastIndexOf("?id=")+4,elem3.href.length);  //uid уникальных артов
/* +add+ */								if (uID.indexOf("&crc") != -1) uID = uID.substring(0,uID.indexOf("&crc"));

	                	                                        price_art = get_price(uID);                                             //цена в базе для этого арта
                                	                                if (price_art != -1) {                                                  //если арт есть в базе
										compare_price(ems3[i].parentNode, elem, price_art, cur_price);	//Сранение цен и закраска
									} else { 								//если арта нет в базе
										add2export(name_art,uID,cur_price);
									}     
									add2report(uID,prochka_cur,prochka_max);
								}
								if (cur_price < s3) {
									ems2[j].parentNode.setAttribute('bgcolor',"#30D5C8");   		//бирюзовая рамочка
									ems2[j].parentNode.setAttribute('width',"56");  			//бирюзовая рамочка
									ems2[j].setAttribute('style',"margin: 3px");            		//бирюзовая рамочка
								}
								if (cur_price < ss) {
									ems2[j].parentNode.setAttribute('bgcolor',"#FF4444");   		//красная рамочка
								}

							}
						}
// ************* Конец обработка обычных артов ****************************
					}
				}
			}

		} 
	} 
//******** Обработка вкладки Комплекты ************************************
	if (document.location.href.indexOf('cat=3') != -1){
		list = 0;
		for (var k = 0; k < all_tables.length; k++)
		{
			if (all_tables[k].className == "wb")
			{
				if (edit_mode == 0) {   									//Если включен обычный режим
					ems = all_tables[k].querySelectorAll( "td > select[onchange*='calc_price']");		//Ищем поле с ценой
				} else {                                                                                        //Если включен режим редактирования
        				ems = all_tables[k].querySelectorAll( "td > input[name*='bcost']"); 			//Ищем поле с ценой
				}
				if (ems.length > 0) 										// Если нашли хоть одно поле с ценой, то ..
				{
					elem = ems[0].parentNode.parentNode.parentNode;						// elem - список комплектов
					list = elem.childElementCount;                                                  	// list - кол-во потомков списка
					break;
				}
			}

		} 
		for (var k = 2; k <=list; k++)											// для каждого комплекта...
		{                                                                                                               //если не комплект, то пропускаем
			if (elem.childNodes[k].tagName == "SCRIPT") { continue;	} 
			ss_kompl = 0;
			sum_price = 0;
			elem2 = elem.childNodes[k].childNodes[0].childNodes[0].childNodes[0].childNodes[0];//			// elem2 - список компонентов комплекта
			for (var i = 0; i < elem2.childElementCount; i++)							// для каждого арта в комплекте...
			{
				if (elem2.childNodes[i].childNodes[0].getAttribute('background') == null) {                     
 					if (elem2.childNodes[i].childNodes[0].childNodes[0].getAttribute('src') == "") {        //если уникальные
						art_url = elem2.childNodes[i].childNodes[0].href;			        //ссылка на картинку арта
						art_type = art_url.substring(art_url.lastIndexOf("=")+1,art_url.length); 	//название арта
//						alert('1');
						elem3 = elem2.children[i].children[0].children[0].children[0].children[0].children[0];
					} else {                                                                                //если обычный арт без крафта, то ..
						art_url = elem2.childNodes[i].childNodes[0].childNodes[0].getAttribute('src');	//ссылка на картинку арта
						art_type = art_url.substring(art_url.lastIndexOf("/")+1,art_url.lastIndexOf(".")-2); 	//название арта
						elem3 = elem2.children[i].children[0];
					}
					title = elem2.childNodes[i].childNodes[0].childNodes[0].title;
				} else {											//если арт c крафтом, то ..
					elem3 = elem2.children[i].children[0].children[0].children[0].children[0].children[0];
                                        if (elem3.tagName == "TABLE") {								 // Если трофеи.
						elem3 = elem3.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
						art_url = elem3.href;
						art_type = art_url.substring(art_url.lastIndexOf("?")+4,art_url.indexOf("&")); 	//название арта
					} else {
						art_url = elem2.childNodes[i].childNodes[0].getAttribute('background');		//ссылка на картинку арта
						art_type = art_url.substring(art_url.lastIndexOf("/")+1,art_url.lastIndexOf(".")-2); 	//название арта
					}
					title = elem3.children[0].title;
				}
				cena_rem = get_price_rem(art_type)[1];
				art_klass = get_price_rem(art_type)[0];
//********************************			
		                name_art = title;
				pos = name_art.lastIndexOf(ustring("Нападение"));	if (pos != -1) { name_art = name_art.substring(0,pos-1); }
				pos = name_art.lastIndexOf(ustring("Защита"));		if (pos != -1) { name_art = name_art.substring(0,pos-1); }
				pos = name_art.lastIndexOf(ustring("Сила"));		if (pos != -1) { name_art = name_art.substring(0,pos-1); }
				pos = name_art.lastIndexOf(ustring("Инициатива"));	if (pos != -1) { name_art = name_art.substring(0,pos-1); }
				pos = name_art.lastIndexOf(ustring("Знание"));		if (pos != -1) { name_art = name_art.substring(0,pos-1); }
				pos = name_art.lastIndexOf(ustring("Удача"));		if (pos != -1) { name_art = name_art.substring(0,pos-1); }
				pos = name_art.lastIndexOf(ustring("Боевой"));		if (pos != -1) { name_art = name_art.substring(0,pos-1); }
				pos = name_art.lastIndexOf(ustring("Прочность"));	if (pos != -1) { name_art = name_art.substring(0,pos-1); }
//********************************					
				prochka = title.substring(title.lastIndexOf(" ")+1,title.length);    				//прочка в формате хх/уу
				prochka_cur = prochka.substring(0,prochka.lastIndexOf("/"));                			//текущая прочка
				prochka_max = prochka.substring(prochka.lastIndexOf("/")+1,prochka.length); 			//макс.прочка
				uID = elem3.href.substring(elem3.href.lastIndexOf("?id=")+4,elem3.href.length); 		//uid уникальных артов
/* +add+ */			if (uID.indexOf("&crc") != -1) uID = uID.substring(0,uID.indexOf("&crc"));
				price_art = get_price(uID);                                                     		//цена в базе для этого арта
//********************************					
				ss = Math.ceil(cena_rem*stavka_kuzni/100/Math.floor(prochka_max*0.9));
	                        ss_kompl += ss;
				if (price_art != -1) {                                                           		//если арт есть в базе
					sum_price += Number(price_art);                                                         //считаем суммарную стоимость
				} else { 											//если арта нет в базе
					add2export(name_art,uID,1);
				}
				add2report(uID,prochka_cur,prochka_max);
			}
//********************************					
			if (edit_mode == 0) {   //Если включен обычный режим
				ems3 = elem.childNodes[k].querySelectorAll( "td [width*='80']");		 		//Ищем поле с ценой
				if (ems3.length == 0) { 
//					alert('Field with price not found.');
					cur_price = 0;
				} else {
					cur_price = ems3[0].childNodes[0].innerHTML;                   				//Цена аренды
					}
			} else {                                                						//Если включен режим редактирования
				ems3 = elem.childNodes[k].querySelectorAll( "td > input[name*='bcost']"); 			//Ищем поле с ценой
				cur_price = ems3[0].getAttribute('value');                                 			//Цена аренды
				elem2.innerHTML += '<br><font style="color:#0132CC;">'+'<b>'+ustring('<font style="font-size:10px; color:#0132CC;">c/с след.ремонта: <font style="font-size:12px;">')+ss_kompl+'</b></font><BR>';
				if (ss_kompl > cur_price) {                                                                     // Если с/с ремонта выше цены, то...
	                                elem2.parentNode.parentNode.parentNode.setAttribute('bgcolor',"#FFBBCC");               // розовый фон делаем
				}
				compare_price(ems3[0].parentNode, elem2, sum_price, cur_price);          			//Сранение цен и закраска
			}
		} 
	}
//******** Обработка вкладок Недоступные и в ремонте ********************
	if (((document.location.href.indexOf('cat=5') != -1) || (document.location.href.indexOf('cat=4') != -1) ) && (edit_mode != 0)) {
		list = 0;
		pos_write = 2;
		for (var k = 0; k < all_tables.length; k++)
		{
			if (all_tables[k].className == "wb")
			{
       				ems = all_tables[k].querySelectorAll( "td > input[name*='bcost']"); 				//Ищем поле с ценой
				if (ems.length > 0) 										// Если нашли хоть одно поле с ценой, то ..
				{
					elem = ems[0].parentNode.parentNode.parentNode;						// elem - список комплектов
					list = elem.childElementCount;                                                  	// list - кол-во потомков списка
					break;
				}
			}

		}
		for (var k = 1; k <list; k++)											// для каждого комплекта...
		{                                                                                                               //если не комплект, то пропускаем
			if (elem.children[k].tagName == "SCRIPT") { continue;} 
			if (elem.children[k].children[0].childElementCount >0) {
				if (elem.children[k].children[0].children[0].type == "submit") 	continue;			//если кнопка "сделать комплектом"-пропустить
			} 
			ss_kompl = 0;
			sum_price = 0;
                        if (document.location.href.indexOf('cat=5') != -1) {							// если вкладка Недоступные
				if ((elem.children[k].childNodes[0].childElementCount == 0) && (elem.children[k].childNodes[1].childNodes[0].tagName == "TABLE") && (elem.children[k].childNodes[1].childNodes[0].getAttribute('background') == null)) {
					elem2 = elem.children[k].children[1].children[0].children[0].children[0];		// elem2 - список компонентов комплекта
					single = 0;
				} else {											// если одиночный арт
					elem2 = elem.children[k].children[1];//							// elem2 - одиночный арт
					single = 1;
				}
			} else {												// если вкладка в Ремонте
				if (elem.children[k].childElementCount == 13) {
					single = 0;
					elem2 = elem.children[k].children[0].children[0].children[0].children[0];//		// elem2 - список компонентов комплекта
				} else {											// если одиночный арт
					elem2 = elem.children[k].children[0];//							// elem2 - одиночный арт
					single = 1;
					pos_write = 1;
				}
			}
			for (var i = 0; i < elem2.childElementCount; i++)							// для каждого арта в комплекте...
			{
				if (single == 1) {	elem4 = elem2;
				} else {		elem4 = elem2.childNodes[i];
				}
				if (elem4.childNodes[0].getAttribute('background') == null) {
 					if (elem4.childNodes[0].childNodes[0].getAttribute('src') == "") {        		//если уникальные
						art_url = elem4.childNodes[0].href;			        		//ссылка на картинку арта
						art_type = art_url.substring(art_url.lastIndexOf("=")+1,art_url.length); 	//название арта
						elem3 = elem4.children[0].children[0].children[0].children[0].children[0];
					} else {                                                                                //если обычный арт без крафта, то ..
						art_url = elem4.childNodes[0].childNodes[0].getAttribute('src');		//ссылка на картинку арта
						art_type = art_url.substring(art_url.lastIndexOf("/")+1,art_url.lastIndexOf(".")-2); 	//название арта
						elem3 = elem4.children[0];
					}
					title = elem4.childNodes[0].childNodes[0].title;
				} else {											//если арт c крафтом, то ..
					elem3 = elem4.children[0].children[0].children[0].children[0].children[0];
                                        if (elem3.tagName == "TABLE") {								 // Если трофеи.
						elem3 = elem3.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
						art_url = elem3.href;
						art_type = art_url.substring(art_url.lastIndexOf("?")+4,art_url.indexOf("&")); 	//название арта
					} else {
						art_url = elem4.childNodes[0].getAttribute('background');			//ссылка на картинку арта
						art_type = art_url.substring(art_url.lastIndexOf("/")+1,art_url.lastIndexOf(".")-2); 	//название арта
					}
					title = elem3.children[0].title;
				}
				cena_rem = get_price_rem(art_type)[1];
				art_klass = get_price_rem(art_type)[0];
//********************************			
		                name_art = title;
				pos = name_art.lastIndexOf(ustring("Нападение"));	if (pos != -1) { name_art = name_art.substring(0,pos-1); }
				pos = name_art.lastIndexOf(ustring("Защита"));		if (pos != -1) { name_art = name_art.substring(0,pos-1); }
				pos = name_art.lastIndexOf(ustring("Сила"));		if (pos != -1) { name_art = name_art.substring(0,pos-1); }
				pos = name_art.lastIndexOf(ustring("Инициатива"));	if (pos != -1) { name_art = name_art.substring(0,pos-1); }
				pos = name_art.lastIndexOf(ustring("Знание"));		if (pos != -1) { name_art = name_art.substring(0,pos-1); }
				pos = name_art.lastIndexOf(ustring("Удача"));		if (pos != -1) { name_art = name_art.substring(0,pos-1); }
				pos = name_art.lastIndexOf(ustring("Боевой"));		if (pos != -1) { name_art = name_art.substring(0,pos-1); }
				pos = name_art.lastIndexOf(ustring("Прочность"));	if (pos != -1) { name_art = name_art.substring(0,pos-1); }
//********************************					
				prochka = title.substring(title.lastIndexOf(" ")+1,title.length);    				//прочка в формате хх/уу
				prochka_cur = prochka.substring(0,prochka.lastIndexOf("/"));                			//текущая прочка
				prochka_max = prochka.substring(prochka.lastIndexOf("/")+1,prochka.length); 			//макс.прочка
				uID = elem3.href.substring(elem3.href.lastIndexOf("?id=")+4,elem3.href.length); 		//uid уникальных артов
/* +add+ */			if (uID.indexOf("&crc") != -1) uID = uID.substring(0,uID.indexOf("&crc"));
				price_art = get_price(uID);                                                     		//цена в базе для этого арта
//********************************					
				if (elem4.childNodes[0].getAttribute('background') == null) {                     		//если уникальный арт, то ..
					if (elem4.childNodes[0].childNodes[0].getAttribute('src') == "") {
						ss = Math.ceil(cena_rem*stavka_kuzni/100/Math.floor(prochka_max*0.9));
					} else {
						if ((art_klass >0 && art_klass<10) && (prochka_max > 49) && ((prochka_max % 5) == 0) ) { //Если это госарт, то ..
							ss = Math.ceil(Math.ceil(cena_rem*20/19)/prochka_max);                 //Себестоимость 1 боя
						} else	{
							ss = Math.ceil(cena_rem*stavka_kuzni/100/Math.floor(prochka_max*0.9));
						}
					}
				}  else	{											//если обычный арт, то ..
					ss = Math.ceil(cena_rem*stavka_kuzni/100/Math.floor(prochka_max*0.9));
				}
	                        ss_kompl += ss;
//				alert(uID+' '+art_type+' '+cena_rem+' '+art_klass+' '+prochka_cur+' '+prochka_max);
				if (price_art != -1) {                                                           		//если арт есть в базе
					sum_price += Number(price_art);                                                         //считаем суммарную стоимость
				} else { 											//если арта нет в базе
				        if (single != 1) {add2export(name_art,uID,1);}						//Запоминаем uID этого арта и стоимость 
				}
				add2report(uID,prochka_cur,prochka_max);
			}
//********************************					
			ems3 = elem.children[k].querySelectorAll( "td > input[name*='bcost']"); 				//Ищем поле с ценой
			cur_price = ems3[0].getAttribute('value');                                 				//Цена аренды
			if (single == 1) {                                                                              	//если одиночный арт
				if (price_art == -1) {add2export(name_art,uID,cur_price);}					//если арта нет в базе
				elem2.parentNode.childNodes[pos_write].innerHTML += '<br><font style="color:#0132CC;">'+'<b>'+ustring('<font style="font-size:10px; color:#0132CC;">c/с след.ремонта: <font style="font-size:12px;">')+ss_kompl+'</b></font><BR>';
				if (ss_kompl > cur_price) {                                                                     // Если с/с ремонта выше цены, то...
        	                       elem2.parentNode.childNodes[1].setAttribute('bgcolor',"#FFBBCC");			// розовый фон делаем
				}
				compare_price(ems3[0].parentNode, elem2.parentNode.childNodes[pos_write], sum_price, cur_price);//Сранение цен и закраска
			} else {                                                                                        	// если комплект
				elem2.innerHTML += '<br><font style="color:#0132CC;">'+'<b>'+ustring('<font style="font-size:10px; color:#0132CC;">c/с след.ремонта: <font style="font-size:12px;">')+ss_kompl+'</b></font><BR>';
				if (ss_kompl > cur_price) {									// Если с/с ремонта выше цены, то...
        	                       elem2.parentNode.parentNode.parentNode.setAttribute('bgcolor',"#FFBBCC");		// розовый фон делаем
				}
				compare_price(ems3[0].parentNode, elem2, sum_price, cur_price);					//Сранение цен и закраска
			}
		} 
	}
	if (s_exp.length > 0) alert(ustring('В базу цен (в файл) не внесены следуюшие арты:\n')+s_exp); 			//вывести список отсутствующих в базе артов
	if (s_report.length > 0) alert(ustring('Прочность артов:\n')+s_report); 						//вывести список артов с прочкой
//********************************					
	ems = document.querySelectorAll( "textarea[name*='clanskladinfo']");			 				//Ищем поле инфы склада
	if (ems.length != 0) { 	ems[0].rows =25; }										//увеличиваем размер
}
//****************************************************************************************
function inventory_info() {
	var ems, s, uID, nameArt, price_art;
	ems = document.querySelectorAll( "td > a[href*='&crc']")
	if (ems.length != 0) {
		for (var k = 0; k <ems.length; k++) {
			s = ems[k].href;
			uID = s.substring(s.lastIndexOf("?id=")+4,s.indexOf("&crc")); 						//uid уникальных артов
			price_art = get_price(uID);
			if ((s_exp.indexOf(uID) == -1) && (price_art == -1)) { 
	        	        if (ems[k].childNodes[0].tagName == "IMG")	nameArt = ems[k].childNodes[0].title.split(" \n")[0];
		                if (ems[k].childNodes[0].tagName == "B")	nameArt = ems[k].childNodes[0].innerHTML;
				add2export(nameArt,uID,1);
			}
		}
		if (s_exp.length > 0) alert(ustring('В базу цен (в файл) не внесены следуюшие арты:\n')+s_exp);			//вывести список отсутствующих в базе артов
	} else {alert('HET :(');}
}
//****************************************************************************************
function inv_and_house_report() {
	var ems, s, uID, iD, prochka_cur,prochka_max, price_art, proch;
	ems = document.querySelectorAll( "td > a[href*='&crc']")
	if (ems.length != 0) {
		for (var k = 0; k <ems.length; k++) {
			s = ems[k].href;
			uID = s.substring(s.lastIndexOf("?id=")+4,s.indexOf("&crc")); 						//uid уникальных артов
			ID  = s.substring(s.lastIndexOf("uid=")+4,s.indexOf("&crc")); 						//id артов(с uid)
			price_art = get_price(uID);
			if ((s_report.indexOf(ID) == -1) && (price_art != -1)) { 
	        	        if (ems[k].childNodes[0].tagName == "IMG")	proch = ems[k].childNodes[0].title.split(ustring('Прочность: '))[1];
		                if (ems[k].childNodes[0].tagName == "B") {
					proch = ems[k].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.nextSibling.childNodes[0].childNodes[0].innerHTML;
					proch = proch.split('<')[0].split(ustring('Прочноcть: '))[1];
				}
				prochka_cur = proch.split('/')[0];
				prochka_max = proch.split('/')[1];
				add2report(ID,prochka_cur,prochka_max);
			}
		}
	if (s_report.length > 0) alert(ustring('Прочность артов:\n')+s_report); 						//вывести список артов с прочкой
	} else {alert('HET :(');}
}
//****************************************************************************************
function house_info() {
	var ems, s, uID, nameArt, price_art;
	ems = document.querySelectorAll( "td > a[href*='&crc']")
	if (ems.length != 0) {
		for (var k = 0; k <ems.length; k++) {
			s = ems[k].href;
			uID = s.substring(s.lastIndexOf("?id=")+4,s.indexOf("&crc")); 						//uid уникальных артов
			price_art = get_price(uID);
			if ((s_exp.indexOf(uID) == -1) && (price_art == -1)) {
				nameArt = ems[k].childNodes[0].title.split(" \n")[0];
				add2export(nameArt,uID,1);
			}
		}
		if (s_exp.length > 0) alert(ustring('В базу цен (в файл) не внесены следуюшие арты:\n')+s_exp);			//вывести список отсутствующих в базе артов
	} else {alert('HET :(');}
}
//****************************************************************************************
if (document.location.href.indexOf('sklad_info') != -1)  sklad_info();
if ((document.location.href.indexOf('inventory') != -1) && inv_verify) inventory_info();
if (((document.location.href.indexOf('inventory') != -1) || (document.location.href.indexOf('house_info') != -1)) && make_report) inv_and_house_report();
if ((document.location.href.indexOf('house_info') != -1) && house_verify) house_info();
