var defDate = new Date();
console.log(defDate);
var hours = (defDate.getHours());
var minutes = defDate.getMinutes();
  if (minutes.toString().length == 1){
      minutes = '0' + minutes;
      }
var defTime = hours +':'+ minutes;
document.getElementById('date').valueAsDate = defDate;
console.log(defDate);
document.getElementById('time').value = defTime;
console.log(defTime);

function tog(v){
  return v?'addClass':'removeClass';
} 
$(document).on('input', '.clearable', function(){
    $(this)[tog(this.value)]('x');
       }).on('mousemove', '.x', function( e ){
    $(this)[tog(this.offsetWidth-18 < e.clientX-this.getBoundingClientRect().left)]('onX');
       }).on('touchstart click', '.onX', function( ev ){
       ev.preventDefault();
       $(this).removeClass('x onX').val('').change();
    });
var datePicker = document.getElementById('date');
var today = new Date();
var day = today.getDate();
// Set month to string to add leading 0
var mon = new String(today.getMonth()+1); //January is 0!
var yr = today.getFullYear();
      if(mon.length < 2) { mon = "0" + mon; }
var date = new String( yr + '-' + mon + '-' + day );
console.log(date);
datePicker.disabled = false; 
datePicker.setAttribute('min', date);

$(".btn").click(function(e) {
  $('#visualisation').empty();
    var source = $("#autocomplete").val();
    var destination = $("#autocomplete2").val();
    var myDate = $("#date").val();
    console.log(myDate);
    var currentDate = new Date(myDate);
    console.log(currentDate);
    var time = $("#time").val();
    var	dateParts = myDate.split('-').reverse(),
        timeParts = time.split(':'),
        date;
    var currentTime = new Date();
    console.log(currentTime);
if((parseInt(timeParts[0]) < currentTime.getHours()) && (currentDate == currentTime)){
  $('#visualisation').append("<h2>Please select a future time</h2>");
}
else{

        date = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1]);
        var depTime = date.getTime()/1000;

        var MAP_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=';
        var commuteTime = [];
        var transitTime = [];
        for (var i = 0; i < 9; i++){
            var sTime = (depTime + 900 * i);
            commute(source, destination, sTime);
        }
    }

function sorting(json_object, key_to_sort_by) {
        function sortByKey(a, b) {
            var x = a[key_to_sort_by];
            var y = b[key_to_sort_by];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }
    json_object.sort(sortByKey);
}

function commute(src,dest,bTime){
  $.ajax({
    url: MAP_URL + src +'&destinations='+ dest + '&mode=driving&departure_time='+ bTime +'&traffic_model=best_guess&key=AIzaSyBUkUqR2r2dfMNgribh4X8XjorobxHTMYA',
    async: true,
    dataType: 'json',
    error: function(){
      alert('Failed to get commute times for given time of departure.');
    },
    success: function(data){
      var dateString = new Date(bTime * 1000);
          var timeString = dateString.toTimeString();
          var arr = timeString.split(":");
          var axisTime = arr[0] + ":" + arr[1];
          var cTime = data.rows[0].elements[0].duration.text;
          var name = data.rows[0].elements[0].duration_in_traffic.text;
          var aTime = name.split(" ");
          cTime = cTime.split(" ");
          if (cTime.length > 2){
            var a = parseInt(cTime[0]) * 60 ;
           cTime = a + parseInt(cTime[2]);
          cTime= parseInt(cTime);
        }
        else{
        cTime = parseInt(cTime[0]);
        }
        
          if (aTime.length > 2){
            var a = parseInt(aTime[0]) * 60 ;
          var y = a + parseInt(aTime[2]);
          y = parseInt(y);
        }
        else{
          y = parseInt(aTime[0]);
        }
          commuteTime.push({name,axisTime,y,cTime});
          transitTime.push(parseInt(cTime));
          sorting(commuteTime,'axisTime');
           if (commuteTime.length == 9){
          initChart();
        }
      }
    });
}

function initChart(){
  $(function () {
      var chart = new Highcharts.Chart({
        
        chart: {
            type: 'column',
            renderTo: 'visualisation',
            events: {
                load: function (event) {
                    var seriesData = this.series[0].data;
                    var tCategories = [];
                    for (i = 0; i < seriesData.length; i++) {
                        tCategories.push(seriesData[i].axisTime);
                    }
                    this.xAxis[0].setCategories(tCategories);
                }
                }
              },
              title : {
              text:'Commute times'
            },
        xAxis: {
            title: {
                text: 'Departure time (hh:mm)'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Approx. Commute Time (minutes)'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 50,
            verticalAlign: 'top',
            y: 10,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        /*legend: {
            enabled: false
          },*/
        
          tooltip: {
            pointFormat: 'Commute time : <b>{point.name}</b><br/>Commute time'+
                           '(normal traffic) : <b>{point.cTime}'+'mins</b>'

        },
       series: [{
            name: 'Commute time in traffic',
            type: 'column',
            data: commuteTime
        },
        {
            name: 'Normal commute time',
            type: 'line',
            data: transitTime,
            marker: {
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[1],
                fillColor: 'white'
            }
        }]
    });
});
}
});
// Load the fonts
Highcharts.createElement('link', {
   href: 'https://fonts.googleapis.com/css?family=Unica+One',
   rel: 'stylesheet',
   type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);

Highcharts.theme = {
   colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
      "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
   chart: {
      backgroundColor: {
         linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
         stops: [
            [0, '#2a2a2b'],
            [1, '#3e3e40']
         ]
      },
      style: {
         fontFamily: "'Arial', sans-serif"
      },
      plotBorderColor: '#606063'
   },
   title: {
      style: {
         color: '#E0E0E3',
         textTransform: 'uppercase',
         fontSize: '20px'
      }
   },
   subtitle: {
      style: {
         color: '#E0E0E3',
         textTransform: 'uppercase'
      }
   },
   xAxis: {
      gridLineColor: '#707073',
      labels: {
         style: {
            color: '#E0E0E3'
         }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      title: {
         style: {
            color: '#A0A0A3'

         }
      }
   },
   yAxis: {
      gridLineColor: '#707073',
      labels: {
         style: {
            color: '#E0E0E3'
         }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      tickWidth: 1,
      title: {
         style: {
            color: '#A0A0A3'
         }
      }
   },
   tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      style: {
         color: '#F0F0F0'
      }
   },
   plotOptions: {
      series: {
         dataLabels: {
            color: '#B0B0B3'
         },
         marker: {
            lineColor: '#333'
         }
      },
      boxplot: {
         fillColor: '#505053'
      },
      candlestick: {
         lineColor: 'white'
      },
      errorbar: {
         color: 'white'
      }
   },
   legend: {
      itemStyle: {
         color: '#E0E0E3'
      },
      itemHoverStyle: {
         color: '#FFF'
      },
      itemHiddenStyle: {
         color: '#606063'
      }
   },
   credits: {
      style: {
         color: '#666'
      }
   },
   labels: {
      style: {
         color: '#707073'
      }
   },

   drilldown: {
      activeAxisLabelStyle: {
         color: '#F0F0F3'
      },
      activeDataLabelStyle: {
         color: '#F0F0F3'
      }
   },

   navigation: {
      buttonOptions: {
         symbolStroke: '#DDDDDD',
         theme: {
            fill: '#505053'
         }
      }
   },

   // scroll charts
   rangeSelector: {
      buttonTheme: {
         fill: '#505053',
         stroke: '#000000',
         style: {
            color: '#CCC'
         },
         states: {
            hover: {
               fill: '#707073',
               stroke: '#000000',
               style: {
                  color: 'white'
               }
            },
            select: {
               fill: '#000003',
               stroke: '#000000',
               style: {
                  color: 'white'
               }
            }
         }
      },
      inputBoxBorderColor: '#505053',
      inputStyle: {
         backgroundColor: '#333',
         color: 'silver'
      },
      labelStyle: {
         color: 'silver'
      }
   },

   navigator: {
      handles: {
         backgroundColor: '#666',
         borderColor: '#AAA'
      },
      outlineColor: '#CCC',
      maskFill: 'rgba(255,255,255,0.1)',
      series: {
         color: '#7798BF',
         lineColor: '#A6C7ED'
      },
      xAxis: {
         gridLineColor: '#505053'
      }
   },

   scrollbar: {
      barBackgroundColor: '#808083',
      barBorderColor: '#808083',
      buttonArrowColor: '#CCC',
      buttonBackgroundColor: '#606063',
      buttonBorderColor: '#606063',
      rifleColor: '#FFF',
      trackBackgroundColor: '#404043',
      trackBorderColor: '#404043'
   },

   // special colors for some of the
   legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
   background2: '#505053',
   dataLabelsColor: '#B0B0B3',
   textColor: '#C0C0C0',
   contrastTextColor: '#F0F0F3',
   maskColor: 'rgba(255,255,255,0.3)'
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);

var placeSearch, autocomplete,autocomplete2;

function initAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.Autocomplete(
            (document.getElementById('autocomplete')),
            {types: ['geocode']});

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete.addListener('place_changed', function(){
          fillInAddress(autocomplete,'')
        });

        autocomplete2 = new google.maps.places.Autocomplete(
            (document.getElementById('autocomplete2')),
            {types: ['geocode']});

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete2.addListener('place_changed', function(){
          fillInAddress(autocomplete2,'2')
        });
      }

      function fillInAddress(autocomplete,unique) {
        // Get the place details from the autocomplete object.
        var place = autocomplete.getPlace();
      }

      // Bias the autocomplete object to the user's geographical location,
      // as supplied by the browser's 'navigator.geolocation' object.
      function geolocate() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
              center: geolocation,
              radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
          });
        }
      }


