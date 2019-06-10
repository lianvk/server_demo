// function GoToPlace(xx,yy,zoom,gr){
//     myMap.setCenter([xx,yy],zoom);
//     group_id=gr;   
//     };
// $(window).on('hashchange', function() { setMapStateByHash(); });
function AreaMenu(tx1,ty1){
    strokeColor='#39598e';          
    strokeWidth=4;  
    var arr=[[]];
    comment="Регуляторный пункт";
    area_add(arr,comment,strokeColor,strokeWidth,true);
}

function GasLineMenu(tx1,ty1){   
    strokeColor='#ff0000';          
    strokeWidth=4;  
    comment="Сегмент газопровода";
    var arr_seg=[[tx1, ty1]];
    polyadd(arr_seg,comment,strokeColor,strokeWidth,true);
}

function MetkaMenu(tx1,ty1){
    var dialog;
        $(document).ready(function () {
            $("#dialog").dialog('open');
            dialog = $("#dialog").dialog({
                uiLibrary: 'bootstrap',
                title: 'Settings'
            });
        });
        var arr=[tx1, ty1];
    comment="Объект потребления газа";
    presetcolor="#ffffff";
    point_add(arr,comment,presetcolor);

    document.getElementById("saving").onclick = function()
    {
        
        var nummar = document.getElementsByName("nummar")[0].value;
        var balans = document.getElementsByName("balans")[0].value;
        var tip = document.getElementsByName("tip")[0].value;
        var ich = document.getElementsByName("ich")[0].value;
      
         MetkaAdd(tx1,ty1,nummar,balans,tip,ich);
            $("#dialog").dialog('close');

        // MetkaAdd(tx1,ty1,nummar,balans);
        return false;
    }
}


//добавляем обьект "Метка"
function MetkaAdd(tx1,ty1,nummar,balans,tip,ich){            
    // function MetkaAdd(tx1,ty1,nummar,balans){
    $.ajax({
        url:"/metka",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            lon: tx1,
            lat: ty1,
            comment: comment,
            nummar: nummar,
            balans: balans,
            tip: tip,
            ich: ich
        })
    })                            
    setTimeout(do_search_metka, 1000);        
}

//добавляем обьект "Линия"
function GasLineAdd(coor,comment,nummar_seg,balans_seg,tip_seg,mat_seg,d_seg,ich_seg){    
    $.ajax({
        url:"/segment",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            title: comment,
            coor: coor,
            nummar_seg: nummar_seg,
            balans_seg: balans_seg,
            tip_seg: tip_seg,
            mat_seg: mat_seg,
            d_seg: d_seg,
            ich_seg: ich_seg
        })
    })  
    setTimeout(do_search_segment, 1000); 
}  

function AreaAdd(coor,comment,nummar_rp,balans_rp,tip_rp,ich_rp){    
    $.ajax({
        url:"/rp",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            title: comment,
            coor: coor,
            nummar_rp: nummar_rp,
            balans_rp: balans_rp,
            tip_rp: tip_rp,
            ich_rp: ich_rp
        })
    })  
    setTimeout(do_search_rp, 1000);
}      

var myMap;

    ymaps.ready(function () {

        myCollection = new ymaps.GeoObjectCollection();
        myCollectionSeg = new ymaps.GeoObjectCollection();
        myCollectionRP = new ymaps.GeoObjectCollection();
        myCollectiontemp = new ymaps.GeoObjectCollection();


let YandexMapLayer = ymaps.layer.storage.get('yandex#map');
//создаем свой слой
let CustomMapLayer = function () {  
    CustomMapLayer.superclass.constructor.call(this);
    this._maxAvaliableZoom = 19; 
    this._zoomRange = [0, 22]; 
}

ymaps.util.augment(CustomMapLayer, YandexMapLayer, {
    getZoomRange: function (point) {
        let _this = this;
        CustomMapLayer.superclass.getZoomRange.call(this, point).then(function(zoomRange) {
            if (zoomRange[1] != _this._maxAvaliableZoom) {
                _this._maxAvaliableZoom = zoomRange[1];
            }
        });
        return ymaps.vow.resolve(_this._zoomRange);
    }
});

let YCustomMapLayer = function () {

    let layer = new CustomMapLayer();
    let defaultTileUrlTemplate = layer.getTileUrlTemplate();

    layer.getTileSize = function(zoom) {
        
        let pixelRatio = ymaps.util.hd.getPixelRatio();
        if(zoom > layer._maxAvaliableZoom) {
            let scale = 2**(zoom - layer._maxAvaliableZoom);
            let tailImageScale = scale * pixelRatio;
            let zoomOverTileUrlTemplate = defaultTileUrlTemplate
                .replace("%c", "x=%x&y=%y&z="+layer._maxAvaliableZoom)
                .replace("{{ scale }}", tailImageScale > 16 ? 16: tailImageScale);
                
            console.log("zoomOverTileUrlTemplate", zoomOverTileUrlTemplate);
            
            layer.setTileUrlTemplate(zoomOverTileUrlTemplate);
            return [256 * scale, 256 * scale];
        }

        layer.setTileUrlTemplate(defaultTileUrlTemplate);
        return [256, 256];
    };
    
    return layer;
};
//регистрация
ymaps.layer.storage.add('custom#map', YCustomMapLayer);

let customMapType = new ymaps.MapType('Схема_макс', ['custom#map']);

ymaps.mapType.storage.add('custom_map#map', customMapType);
myMap = new ymaps.Map(
    'map',
    {
        // Географические координаты центра отображаемой карты.
        center: [59.95, 30.19], // Питер
        // Масштаб.
        zoom: 10,
        controls: ['searchControl'],
        type: 'custom_map#map'
    },  {
                restrictMapArea: true,
                searchControlProvider: 'yandex#search'
    },);

    var rulerControl = new ymaps.control.RulerControl({
        options: {
            layout: 'round#rulerLayout'
        }
    });

    myMap.controls.add(rulerControl);

    var zoomControl = new ymaps.control.ZoomControl({
        options: {
            layout: 'round#zoomLayout'
        }
    });
    myMap.controls.add(zoomControl);

    // Кнопка ОПГ
    var OPGbutton = new ymaps.control.Button({
    data: {
        image: 'images/bleach(1).png',
        title: 'Добавить ОПГ'
    },
    options: {
        layout: 'round#buttonLayout',
        maxWidth: 120,
        position: {
            top: '90px',
            right: '10px'
        },
        selectOnClick: false
    }
    });

OPGbutton.events.add('click', function(e) {
    needadd=1;
})

myMap.controls.add(OPGbutton);

// кнопка сегмент

var Segmentbutton = new ymaps.control.Button({
    data: {
        image: 'images/gas.png',
        title: 'Добавить сегмент газопровода'
    },
    options: {
        layout: 'round#buttonLayout',
        maxWidth: 120,
        position: {
            top: '140px',
            right: '10px'
        },
        selectOnClick: false
    }
});

Segmentbutton.events.add('click', function(e) {
    needadd=2;
})

myMap.controls.add(Segmentbutton);

// кнопка полигон

var Polygonbutton = new ymaps.control.Button({
    data: {
        image: 'images/polygon.png',
        title: 'Добавить полигон'
    },
    options: {
        layout: 'round#buttonLayout',
        maxWidth: 120,
        position: {
            top: '190px',
            right: '10px'
        },
        selectOnClick: false
    }
});

Polygonbutton.events.add('click', function(e) {
    AreaMenu();
    needadd=3;
})

myMap.controls.add(Polygonbutton);

//кнопка поиск

var SearchObjects = new ymaps.control.Button({
    data: {
        image: 'images/search.png',
        title: 'Поиск объектов'
    },
    options: {
        layout: 'round#buttonLayout',
        maxWidth: 120,
        position: {
            top: '10px',
            right: '10px'
        },
        selectOnClick: false
    }
});

SearchObjects.events.add('click', function(e) {
$.ajax({
    url: "/metka",
    type:"GET",
    contentType: "application/json",
     success: function (metka) {
                    var rows = "";
                    $.each(metka, function (index, metk) {
                      rows +=  row(metk);
                    })
                    $("table tbody").append(rows);
                 }
    });  

$.ajax({
    url: "/segment",
    type:"GET",
    contentType: "application/json",
     success: function (segment) {
                    var rows = "";
                    $.each(segment, function (index, seg) {
                      rows +=  row(seg);
                    })
                    $("table tbody").append(rows);
                 }
    });  

$.ajax({
    url: "/rp",
    type:"GET",
    contentType: "application/json",
     success: function (rp) {
                    
                       var rows = "";
                    $.each(rp, function (index, rp1) {
                      rows +=  row(rp1);
                    })
                    $("table tbody").append(rows);                  
                 }
    });  

    var dialog;
        $(document).ready(function () {
            // $("#dialog_poisk").dialog('open');
            dialog = $("#dialog_poisk").dialog({
                // uiLibrary: 'bootstrap',
                // title: 'Settings',
                 width: 1200 
                         
            });
        });

        $("#dialog_poisk").dialog('open');
        $(document).ready(function(){
            $("#search").keyup(function(){
                _this = this;
                $.each($("#mytable tbody tr"), function() {
                    if($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) === -1)
                       $(this).hide();
                    else
                       $(this).show();                
                });
            });
        });

        $(document).ready(function()
{
 $('#mytable').on('click', 'tbody tr', function()
 {
  var id = $(this).children('td:first-child').text();

  var ti = $(this).children('td:nth-child(2)').text();

  if (ti == 'Объект потребления газа') {
    $.ajax({
    url: "/metka/"+id,
    type:"GET",
    contentType: "application/json",
     success: function (metka) {
                    var lon = metka.lon;
                    var lat = metka.lat;
                    var center = [lon,lat];
  myMap.setCenter([lon,lat],18);
  myCollectiontemp.removeAll();
point_add_temp(center);

                 }
    }); 

  }

  if (ti == 'Сегмент газопровода'){
    $.ajax({
    url: "/segment/"+id,
    type:"GET",
    contentType: "application/json",
     success: function (segment) {
        var center = segment.coor;
                   var lon = center[0][0];
                    var lat = center[0][1];

  myMap.setCenter([lon,lat],18);
  myCollectiontemp.removeAll();
polyadd_temp(center);

                 }

    }); 
  }

  if (ti == 'Регуляторный пункт')
  {
    $.ajax({
    url: "/rp/"+id,
    type:"GET",
    contentType: "application/json",
     success: function (rp) {
        var center = rp.coor;
                   var lon = center[0][0][0];
                    var lat = center[0][0][1];

  myMap.setCenter([lon,lat],18);
  myCollectiontemp.removeAll();
area_add_temp(center);

                 }

    }); 
  }
  return false;
 });
});
document.getElementById("close_poisk").onclick = function()
   {
    $("#dialog_poisk").dialog('close');
    $("#mytable").find("tr:gt(0)").remove();
    myCollectiontemp.removeAll();
   }

})

myMap.controls.add(SearchObjects);

// var Refreshbutton = new ymaps.control.Button({
//     data: {
//         //image: 'images/polygon.png',
//         title: 'Добавить полигон'
//     },
//     options: {
//         layout: 'round#buttonLayout',
//         maxWidth: 120,
//         position: {
//             top: '190px',
//             right: '10px'
//         },
//         selectOnClick: false
//     }
// });

// Refreshbutton.events.add('click', function(e) {
    
//     $.ajax({
//     url: "/rp",
//     type:"GET",
//     contentType: "application/json",
//      success: function (rp) {

//                     var t0 = performance.now();
//                      drawRP(rp);

// var t1 = performance.now();
// console.log('Took', (t1 - t0).toFixed(4), 'milliseconds');

                       
//                  }                                                      

//     });  
   
  
//     needadd=5;
// })

// myMap.controls.add(Refreshbutton);

// var Distbutton = new ymaps.control.Button({
//     data: {
//         image: 'images/region.png',
//         title: 'Выбрать район'
//     },
//     options: {
//         layout: 'round#buttonLayout',
//         maxWidth: 120,
//         position: {
//             top: '10px',
//             right: '60px'
//         },
//         selectOnClick: false
//     }
// });

// Distbutton.events.add('click', function(e) {
//      var dialog;
//         $(document).ready(function () {
//             // $("#dialog_poisk").dialog('open');
//             dialog = $("#dialog_dist").dialog({
//                 // uiLibrary: 'bootstrap',
//                 // title: 'Settings',
//                  width: 800 
                         
//             });
//         });

//         $('#checkbox').click(function(){
//     if ($(this).is(':checked')){
//         $.ajax({
//     url: "/metka",
//     type:"GET",
//     contentType: "application/json",
//      success: function (metka) {
//         var checked = [];
// $('input:checkbox:checked').each(function() {
//     checked.push($(this).val());
// });
//                if (metka.balans == checked)
//                      drawMetka(metka);
                       
//                  }                                                      

//     });  
//     }
// });

// })

// myMap.controls.add(Distbutton);


/* добавляем на карту контрол выбора типа с указанием стандартных карт и вновь созданной */    
myMap.controls.add(new ymaps.control.TypeSelector({
    options: {
        layout: 'round#listBoxLayout',
        itemLayout: 'round#listBoxItemLayout',
        itemSelectableLayout: 'round#listBoxItemSelectableLayout',
        float: 'none',
        // behaviors: ['drag', 'multiTouch'],
        position: {
            bottom: '40px',
            left: '10px'
        }
    },
    mapTypes: ['custom_map#map','yandex#map', 'yandex#hybrid', 'yandex#satellite'],
}));

// const strat = new Date().getTime();
//do_search_metka();
// const end = new Date().getTime();
// alert('SecondWay: ${end - start}ms');
setTimeout(do_search_segment,1000);
setTimeout(do_search_rp,1000);

myMap.events.add('click', function (e) {
    if (needadd!='null'){
            var coords = e.get('coords');
            mclickx=coords[0].toPrecision(10); 
            mclicky=coords[1].toPrecision(10);
            if (needadd=='1'){MetkaMenu(mclickx,mclicky);needadd='null';myMap.cursors.push("arrow");};
            if (needadd=='2'){GasLineMenu(mclickx,mclicky);needadd='null';myMap.cursors.push("arrow");};
            if (needadd=='3'){AreaMenu(mclickx,mclicky);needadd='null';myMap.cursors.push("arrow");};
            if (needadd=='4'){SearchObjects();};};
        });
                    
        // do_search_metka();      

    });

        function polyadd(txtycoor,comment,strokeColor,strokeWidth,modeadd){   
                        var myPolyline = new ymaps.Polyline(txtycoor, {}, {
                                // Задаем опции геообъекта.
                                // Цвет с прозрачностью.
                                strokeColor: strokeColor,
                                // Ширину линии.
                                strokeWidth: strokeWidth,
                                // Максимально допустимое количество вершин в ломаной.
                                editorMaxPoints: 50,
                                editorMenuManager: function (items) {
                                     items.push({
                                         title: "Сохранить",
                                         onClick: function () {                                 
                                              myPolyline.editor.stopEditing();

              var dialog;
        $(document).ready(function () {
            $("#dialog_seg").dialog('open');
            dialog = $("#dialog_seg").dialog({
                uiLibrary: 'bootstrap',
                title: 'Settings'
            });
        });
        document.getElementById("saving_seg").onclick = function()
    {
        
        var nummar_seg = document.getElementsByName("nummar_seg")[0].value;
        var balans_seg = document.getElementsByName("balans_seg")[0].value;
        var tip_seg = document.getElementsByName("tip_seg")[0].value;
        var mat_seg = document.getElementsByName("mat_seg")[0].value;
        var d_seg = document.getElementsByName("d_seg")[0].value;
        var ich_seg = document.getElementsByName("ich_seg")[0].value;
        var coor = myPolyline.geometry.getCoordinates();
        // var coor = myPolyline.geometry.toEncodedCoordinates(geometry);
    
         GasLineAdd(coor,comment, nummar_seg,balans_seg,tip_seg,mat_seg,d_seg,ich_seg);
            $("#dialog_seg").dialog('close');

        // MetkaAdd(tx1,ty1,nummar,balans);
        return false;
    }

                                         },

                                     });
                                     return items;
                                 },                    
            //                     draggable: true,
                                tfig:"Poly",
                            });                          


                    myPolyline.editor.startEditing(); 
                myPolyline.editor.startDrawing(); 


            myCollectionSeg.add(myPolyline); 
                    myMap.geoObjects.add(myCollectionSeg);    
                    if (modeadd==true){ 
                      myPolyline.editor.startDrawing();                                
                    };
                     
            };


//Полигон
function area_add(txtycoor,comment,strokeColor,strokeWidth,modeadd){        
            var myPolygon = new ymaps.Polygon(txtycoor, {}, {
                    // Задаем опции геообъекта.
                    // Цвет с прозрачностью.
                    strokeColor: strokeColor,
                    // Ширину линии.
                    strokeWidth: strokeWidth,
                    // Максимально допустимое количество вершин в ломаной.
                    editorMaxPoints: 50,
                    editorMenuManager: function (items) {
                         items.push({
                             title: "Сохранить",
                             onClick: function () {                                 
                                myPolygon.editor.stopEditing();
                                           var dialog;
        $(document).ready(function () {
            $("#dialog_rp").dialog('open');
            dialog = $("#dialog_rp").dialog({
                uiLibrary: 'bootstrap',
                title: 'Settings'
            });
        });
        document.getElementById("saving_rp").onclick = function()
    {
        
        var nummar_rp = document.getElementsByName("nummar_rp")[0].value;
        var balans_rp = document.getElementsByName("balans_rp")[0].value;
        var tip_rp = document.getElementsByName("tip_rp")[0].value;
        var ich_rp = document.getElementsByName("ich_rp")[0].value;
        var coor = myPolygon.geometry.getCoordinates();
        // var coor = myPolyline.geometry.toEncodedCoordinates(geometry);
    
         AreaAdd(coor,comment, nummar_rp,balans_rp,tip_rp,ich_rp);
            $("#dialog_rp").dialog('close');

        // MetkaAdd(tx1,ty1,nummar,balans);
        return false;
    }

                             }
                         });
                         return items;
                     },                    
                    draggable: true,
                    tfig:"Area",
                  
                });               
        myPolygon.events.add('click', function (e) {
            if (cured!='null') cured.editor.stopEditing();
            e.get('target').editor.startEditing();            
            cured=e.get('target');
        });
        myCollectionRP.add(myPolygon); 
        myMap.geoObjects.add(myCollectionRP);    
        if (modeadd==true){
  
           myPolygon.editor.startDrawing();                                
        };
};


function point_add(txtycoor,comment,presetcolor){    
    myGeoObject = new ymaps.GeoObject({
        // Описание геометрии.
        geometry: {
            type: "Point",
            coordinates: txtycoor
        },            
        // Свойства.
        properties: {
            // Контент метки.
            hintContent: comment,
            balloonContent:comment
        }
        }, {
        // Опции.
        iconLayout: 'default#image',
        // Иконка метки будет растягиваться под размер ее содержимого.
       iconImageHref: 'images/bleach.png',
       iconImageSize: [32, 32],
        // Метку можно перемещать.
        // draggable: true,
        tfig:"Point"
    });      
                
    myCollection.add(myGeoObject); //добавляем в коллекцию    
    myMap.geoObjects.add(myCollection); // добавляем на холст

};



  function do_search_metka() {
      // считаем, что данные уже пришли с сервера
$.ajax({
    url: "/metka",
    type:"GET",
    contentType: "application/json",
     success: function (metka) {
                    //var t0 = performance.now();
                     drawMetka(metka);

//var t1 = performance.now();
//console.log('Took', (t1 - t0).toFixed(4), 'milliseconds');
                       
                 }                                                      

    });  
   
  }


  function do_search_segment() {
      // считаем, что данные уже пришли с сервера
$.ajax({
    url: "/segment",
    type:"GET",
    contentType: "application/json",
     success: function (segment) {
                    
                        drawSegment(segment);
                   
                 }

    });  
   
  }

  function do_search_rp(){
    $.ajax({
    url: "/rp",
    type:"GET",
    contentType: "application/json",
     success: function (rp) {
                    
                        drawRP(rp);
                   
                 }

    });  

  }


  function drawMetka(metka) {


    myCollection.removeAll();

    var json = metka;

      for (i = 0; i < json.length; i++) {         
          buildPlacemark(json[i]);
      }
      
      function buildPlacemark(point) {
          var layout = ymaps.templateLayoutFactory.createClass(

            '<ul class="list-group">'+
  '<li class="list-group-item list-group-item-success">{{properties.title}}</li>'+
  '<li class="list-group-item">Номер маршрута: {{properties.nummar}}</li>'+
  '<li class="list-group-item">Баланс: {{properties.balans}}</li>'+
  '<li class="list-group-item">Тип здания: {{properties.tip}}</li>'+
  '<li class="list-group-item">Исполнительный чертеж: {{properties.ich}}</li>'+
  '<div class = "butt1">'+
  '<button type="button" class="btn btn-outline-info" id="edit-placemark">Изменить</button>'+
  // '<div class = "butt2">'+
  '<button type="button" class="btn btn-outline-danger" id="remove-placemark">{{properties.buttonText}}</button>' +
'</ul>'

            , {
            build: function () {
                layout.superclass.build.call(this);

                document.getElementById('remove-placemark').addEventListener('click', this.onRemove);
                document.getElementById('edit-placemark').addEventListener('click', this.onEdit);

            },
            clear: function () {
               document.getElementById('remove-placemark').removeEventListener('click', this.onRemove);
               document.getElementById('edit-placemark').removeEventListener('click', this.onEdit);
                layout.superclass.clear.call(this);
            },
            onRemove: function () {     
                alert('Удаление метки с id ' + point._id);

                  $.ajax({
                url: "/metka/" + point._id,
                contentType: "application/json",
                method: "DELETE",
                success: function (metka) {
                    console.log(metk);
                    $("tr[data-rowid='" + metk._id + "']").remove();
                }
            });

                // post на сервер
                myCollection.remove(placemark);   

            },
            onEdit: function(){
    
    var _id_ = point._id;

    $.ajax({
                url: "/metka/"+ _id_,
                type: "GET",
                contentType: "application/json",
                success: function (metka) {
                    // var form = document.forms["userForm"];
                    var nummar1 = metka.nummar;
                    var balans1 = metka.balans;
                    var tip1 = metka.tip;
                    var ich1 = metka.ich;
                    var dialog;
        $(document).ready(function () {
            $("#dialog").dialog('open');
            dialog = $("#dialog").dialog({
                uiLibrary: 'bootstrap',
                title: 'Атрибуты'
            });
        });
document.getElementsByName("nummar")[0].value = nummar1;
document.getElementsByName("balans")[0].value = balans1;
document.getElementsByName("tip")[0].value = tip1;
document.getElementsByName("ich")[0].value = ich1;
                }
            });

    document.getElementById("saving").onclick = function()
    {
        
        var nummar = document.getElementsByName("nummar")[0].value;
        var balans = document.getElementsByName("balans")[0].value;
        var tip = document.getElementsByName("tip")[0].value;
        var ich = document.getElementsByName("ich")[0].value;


 $.ajax({
       url: "/metka/" + _id_,
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
            id: _id_,
            // comment: comment,
            nummar: nummar,
            balans: balans,
            tip: tip,
            ich: ich

        })

    })  ;                      
     
setTimeout(do_search_metka, 1000);
$("#dialog").dialog('close');
         return false;
    // }
       }         
            }
          
        });


          
          var placemark = new ymaps.Placemark([point.lon, point.lat], {
             title: point.title,
             nummar: point.nummar,
             balans: point.balans,
             tip: point.tip,
             ich: point.ich,
              buttonText: "Удалить",

              // buttonText2: "Атрибуты"
          }, 


          {
              balloonContentLayout: layout,
              iconLayout: 'default#image',
              iconImageHref: 'images/bleach.png',
              iconImageSize: [32, 32],
              preset: 'twirl#nightStretchyIcon' ,// иконка растягивается под контент
          draggable:true

          });

          placemark.events.add('dragend', function(e){
            var cord = e.get('target').geometry.getCoordinates();
            tx1=cord[0].toPrecision(10); //где щелкнули?
            ty1=cord[1].toPrecision(10);

            var _id_ = point._id;

             $.ajax({
       url: "/metka/edit/" + _id_,
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
           id: _id_,
            // comment: comment,
            lon: tx1,
            lat: ty1

        })

    })  ;                      

          });

          myCollection.add(placemark);

      }


      myMap.geoObjects.add(myCollection);


  }   



function drawSegment(segment) {


myCollectionSeg.removeAll();          
            
var json = segment;

      for (i = 0; i < json.length; i++) {         
          buildPlace(json[i]);
      }

      function buildPlace(point) {

var layout = ymaps.templateLayoutFactory.createClass(

            '<ul class="list-group">'+
  '<li class="list-group-item list-group-item-success">{{properties.title}}</li>'+
  '<li class="list-group-item">Номер маршрута: {{properties.nummar}}</li>'+
  '<li class="list-group-item">Баланс: {{properties.balans}}</li>'+
  '<li class="list-group-item">Давление: {{properties.tip}}</li>'+
  '<li class="list-group-item">Материал: {{properties.mat}}</li>'+
  '<li class="list-group-item">Диаметр (мм) : {{properties.diam}}</li>'+
  '<li class="list-group-item">Исполнительный чертеж: {{properties.ich}}</li>'+
  '<div class = "butt1">'+
  '<button type="button" class="btn btn-outline-info" id="edit-placemark">Изменить</button>'+
  // '<div class = "butt2">'+
  '<button type="button" class="btn btn-outline-danger" id="remove-placemark">{{properties.buttonText}}</button>' +
'</ul>'

            , {
            build: function () {
                layout.superclass.build.call(this);

                document.getElementById('remove-placemark').addEventListener('click', this.onRemove);
                document.getElementById('edit-placemark').addEventListener('click', this.onEdit);

            },
            clear: function () {
               document.getElementById('remove-placemark').removeEventListener('click', this.onRemove);
               document.getElementById('edit-placemark').removeEventListener('click', this.onEdit);
                layout.superclass.clear.call(this);
            },
            onRemove: function () {  

            alert('Удаление сегмента с id ' + point._id);

                  $.ajax({
                url: "/segment/" + point._id,
                contentType: "application/json",
                method: "DELETE",
                success: function (segment) {
                    console.log(seg);
                    $("tr[data-rowid='" + seg._id + "']").remove();
                }
            });

                // post на сервер
                myCollectionSeg.remove(myPolyline);    

                },

                 onEdit: function(){
    
    var _id_ = point._id;
 alert('Изменение сегмента с id ' + _id_);
    $.ajax({
                url: "/segment/"+ _id_,
                type: "GET",
                contentType: "application/json",
                success: function (segment) {
                    // var form = document.forms["userForm"];
                    var nummar1 = segment.nummar;
                    var balans1 = segment.balans;
                    var tip1 = segment.tip;
                    var mat1 = segment.mat;
                    var diam1 = segment.diam;
                    var ich1 = segment.ich;
                    var dialog;
        $(document).ready(function () {
            $("#dialog_seg").dialog('open');
            dialog = $("#dialog_seg").dialog({
                uiLibrary: 'bootstrap',
                title: 'Атрибуты'
            });
        });

document.getElementsByName("nummar_seg")[0].value = nummar1;
document.getElementsByName("balans_seg")[0].value = balans1;
document.getElementsByName("tip_seg")[0].value = tip1;
document.getElementsByName("mat_seg")[0].value = mat1;
document.getElementsByName("d_seg")[0].value = diam1;
document.getElementsByName("ich_seg")[0].value = ich1;
                }
            });

    document.getElementById("saving_seg").onclick = function()
    {
        
        var nummar = document.getElementsByName("nummar_seg")[0].value;
        var balans = document.getElementsByName("balans_seg")[0].value;
        var tip = document.getElementsByName("tip_seg")[0].value;
        var mat = document.getElementsByName("mat_seg")[0].value;
        var diam = document.getElementsByName("d_seg")[0].value;

        var ich = document.getElementsByName("ich_seg")[0].value;


 $.ajax({
       url: "/segment/" + _id_,
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
            id: _id_,
            // comment: comment,
            nummar: nummar,
            balans: balans,
            tip: tip,
            mat: mat,
            diam: diam,
            ich: ich

        })

    })  ;                      
     
setTimeout(do_search_segment, 1000);
// setTimeout(do_search_metka, 1000);
$("#dialog_seg").dialog('close');
         return false;
    // }
       }         
            }




            });

       var myPolyline = new ymaps.Polyline(point.coor, {
             title: point.title,
             nummar: point.nummar,
             balans: point.balans,
             tip: point.tip,
             mat: point.mat,
             diam: point.diam,
             ich: point.ich,
             buttonText: "Удалить",
        
       }, {

                    balloonContentLayout:layout,
strokeColor:'#ff0000',
                    strokeWidth: 4,
                    // Максимально допустимое количество вершин в ломаной.
                    editorMaxPoints: 50,
                    editorMenuManager: function (items) {
                         items.push({
                             title: "Завершить редактирование",
                             onClick: function () {                                 
                                  myPolyline.editor.stopEditing();
                                  //myPolyline.get(state);
                                       //alert('питух');

      var cord = myPolyline.geometry.getCoordinates();

            var _id_ = point._id;

             $.ajax({
       url: "/segment/edit/" + _id_,
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
           id: _id_,
            // comment: comment,
           cord

        })

    })  ;  
                             }
                         });
                         return items;
                     },                  
                });               


myPolyline.events.add('contextmenu', function(e){
    myPolyline.editor.startEditing();

          });

        myCollectionSeg.add(myPolyline); 

}
 myMap.geoObjects.add(myCollectionSeg);  
 
  }


  function drawRP(rp) {

myCollectionRP.removeAll();          
            
var json = rp;

      for (i = 0; i < json.length; i++) {         
          buildPlace(json[i]);
      }

      function buildPlace(point) {

var layout = ymaps.templateLayoutFactory.createClass(

            '<ul class="list-group">'+
  '<li class="list-group-item list-group-item-success">{{properties.title}}</li>'+
  '<li class="list-group-item">Номер маршрута: {{properties.nummar}}</li>'+
  '<li class="list-group-item">Баланс: {{properties.balans}}</li>'+
  '<li class="list-group-item">Тип: {{properties.tip}}</li>'+
  '<li class="list-group-item">Исполнительный чертеж: {{properties.ich}}</li>'+
  '<div class = "butt1">'+
  '<button type="button" class="btn btn-outline-info" id="edit-placemark">Изменить</button>'+
  // '<div class = "butt2">'+
  '<button type="button" class="btn btn-outline-danger" id="remove-placemark">{{properties.buttonText}}</button>' +
'</ul>'

            , {
            build: function () {
                layout.superclass.build.call(this);

                document.getElementById('remove-placemark').addEventListener('click', this.onRemove);
                document.getElementById('edit-placemark').addEventListener('click', this.onEdit);

            },
            clear: function () {
               document.getElementById('remove-placemark').removeEventListener('click', this.onRemove);
               document.getElementById('edit-placemark').removeEventListener('click', this.onEdit);
                layout.superclass.clear.call(this);
            },
            onRemove: function () {  

            alert('Удаление рп с id ' + point._id);

                  $.ajax({
                url: "/rp/" + point._id,
                contentType: "application/json",
                method: "DELETE",
                success: function (rp) {
                    console.log(rp1);
                    $("tr[data-rowid='" + rp1._id + "']").remove();
                }
            });

                // post на сервер
                myCollectionRP.remove(myPolygon);    

                },

                 onEdit: function(){
    
    var _id_ = point._id;
 alert('Изменение рп с id ' + _id_);
    $.ajax({
                url: "/rp/"+ _id_,
                type: "GET",
                contentType: "application/json",
                success: function (rp) {
                    // var form = document.forms["userForm"];
                    var nummar1 = rp.nummar;
                    var balans1 = rp.balans;
                    var tip1 = rp.tip;
                    var ich1 = rp.ich;
                    var dialog;
        $(document).ready(function () {
            $("#dialog_rp").dialog('open');
            dialog = $("#dialog_rp").dialog({
                uiLibrary: 'bootstrap',
                title: 'Атрибуты'
            });
        });

document.getElementsByName("nummar_rp")[0].value = nummar1;
document.getElementsByName("balans_rp")[0].value = balans1;
document.getElementsByName("tip_rp")[0].value = tip1;
document.getElementsByName("ich_rp")[0].value = ich1;
                }
            });

    document.getElementById("saving_rp").onclick = function()
    {
        
        var nummar = document.getElementsByName("nummar_rp")[0].value;
        var balans = document.getElementsByName("balans_rp")[0].value;
        var tip = document.getElementsByName("tip_rp")[0].value;
        var ich = document.getElementsByName("ich_rp")[0].value;


 $.ajax({
       url: "/rp/" + _id_,
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
            id: _id_,
            // comment: comment,
            nummar: nummar,
            balans: balans,
            tip: tip,
            ich: ich

        })

    })  ;                      
     
setTimeout(do_search_rp, 1000);
// setTimeout(do_search_metka, 1000);
$("#dialog_rp").dialog('close');
         return false;
    // }
       }         
            }




            });

                // post на сервер

    


       var myPolygon = new ymaps.Polygon(point.coor, {
             title: point.title,
             nummar: point.nummar,
             balans: point.balans,
             tip: point.tip,
             ich: point.ich,
             buttonText: "Удалить",
        
       }, {
                    balloonContentLayout:layout,
strokeColor:'#39598e',
                    strokeWidth: 4,
                    // Максимально допустимое количество вершин в ломаной.
                    editorMaxPoints: 50,
                    editorMenuManager: function (items) {
                         items.push({
                             title: "Завершить редактирование",
                             onClick: function () {                                 
                                  myPolygon.editor.stopEditing();
                                  //myPolyline.get(state);
                                      // alert('питух');

      var cord = myPolygon.geometry.getCoordinates();

            var _id_ = point._id;

             $.ajax({
       url: "/rp/edit/" + _id_,
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
           id: _id_,
            // comment: comment,
           cord

        })

    })  ;  
                             }
                         });
                         return items;
                     },                  
                });               

myPolygon.events.add('contextmenu', function(e){
    //alert('питух');

    myPolygon.editor.startEditing();

          });

        myCollectionRP.add(myPolygon); 
       

}
 myMap.geoObjects.add(myCollectionRP);  
 
  } 

 var row = function (item) {
            return "<tr data-rowid='" + item._id + "'><td>"+ item._id + "</td>" +
                   "<td>" + item.title + "</td> <td>" + item.nummar + "</td> <td>" + item.balans + "</td><td>" + item.ich + "</td>";
                   }

function point_add_temp(txtycoor){    
    myGeoObject = new ymaps.GeoObject({
        // Описание геометрии.
        geometry: {
            type: "Point",
            coordinates: txtycoor
        },            
        // Свойства.
        properties: {
            // Контент метки.
            // hintContent: comment,
            // balloonContent:comment
        }
        }, {
        // Опции.
        iconLayout: 'default#image',
        // Иконка метки будет растягиваться под размер ее содержимого.
       iconImageHref: 'images/favicon.png',
       iconImageSize: [32, 32],
        // Метку можно перемещать.
        // draggable: true,
        tfig:"Point"
    });      
                
    myCollectiontemp.add(myGeoObject); //добавляем в коллекцию    
    myMap.geoObjects.add(myCollectiontemp); // добавляем на холст

};

function polyadd_temp(txtycoor){   
                        var myPolyline = new ymaps.Polyline(txtycoor, {}, {
                                // Задаем опции геообъекта.
                                // Цвет с прозрачностью.
                                strokeColor: ['#ff0000','#FFFF00'],
                                // Ширину линии.
                                strokeWidth: [4,2],
                                // Максимально допустимое количество вершин в ломаной.
                                editorMaxPoints: 50,
                                //текстное меню новый пункт, позволяющий удалить ломаную.
                            });               

                myPolyline.editor.startDrawing(); 


            myCollectiontemp.add(myPolyline); 
                    myMap.geoObjects.add(myCollectiontemp);    
          
            };

            function area_add_temp(txtycoor){        
            var myPolygon = new ymaps.Polygon(txtycoor, {}, {
                    // Задаем опции геообъекта.
                    // Цвет с прозрачностью.
                    fillColor: '#f441cd',
                    // Ширину линии.
                    strokeWidth: 4,
                    // Максимально допустимое количество вершин в ломаной.
                    editorMaxPoints: 50
 
                });               

        myCollectiontemp.add(myPolygon); 
        myMap.geoObjects.add(myCollectiontemp);    

};