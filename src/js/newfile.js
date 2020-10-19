//------------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------Main Script file for handling data fetching and chart generation--------------------------------------//
//-----------------------------------------------------------------------------------------------------------------------------------------------//

//-------------------------------------//
//------------DATA FETCH--------------//
//-----------------------------------//

//fetching data from covid19india api
var i;
var xmlhttp = new XMLHttpRequest();
var url = "https://api.covid19india.org/data.json";

xmlhttp.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
        var data = JSON.parse(this.responseText);
        var date = []; //dates of the cases found
        var cumm_conf=[];//cummulative conf cases
        var cumm_dead=[];//cummulative deaths
        var cumm_recov=[];//cummulaitve recovery
        var cumm_active=[];//cummulative active
        var daily_conf =[];//daily conf cases
        var daily_dead =[];//daily deaths
        var daily_recov=[];//daily recovery
        var daily_active=[];//daily active

        //looping across case_time_series
        for(i=0;i<data.cases_time_series.length;i++){
            date.push(data.cases_time_series[i].date);
            cumm_conf.push({"meta":date[i], "value":data.cases_time_series[i].totalconfirmed});
            cumm_dead.push({"meta":date[i], "value":data.cases_time_series[i].totaldeceased});
            cumm_recov.push({"meta":date[i], "value":data.cases_time_series[i].totalrecovered});
            cumm_active.push({"meta":date[i], "value":cumm_conf[i].value-cumm_dead[i].value-cumm_recov[i].value});
            daily_conf.push({"meta":date[i], "value":data.cases_time_series[i].dailyconfirmed});
            daily_dead.push({"meta":date[i], "value":data.cases_time_series[i].dailydeceased});
            daily_recov.push({"meta":date[i],"value":data.cases_time_series[i].dailyrecovered});
            daily_active.push({"meta":date[i], "value":parseInt(daily_conf[i].value)-parseInt(daily_dead[i].value)-parseInt(daily_recov[i].value)});
        }
        // console.log(case_obj)
        //chart for cases vs days
        
        renderLineChart(date,cumm_conf,'#ct-chart-conf-cumm');//cumm conf graph 
        renderLineChart(date,cumm_dead,'#ct-chart-dead-cumm');//cumm dead      
        renderLineChart(date,cumm_recov,'#ct-chart-recov-cumm');//cumm recov
        renderLineChart(date,cumm_active,'#ct-chart-active-cumm');//cumm active

        renderBarChartPeak(date,daily_conf,'#ct-chart-conf-daily');//daily conf graph
        renderBarChartPeak(date,daily_dead,'#ct-chart-dead-daily');//daily dead
        renderBarChartPeak(date,daily_recov,'#ct-chart-recov-daily');//daily recov
        renderBarChartPeak(date,daily_active,'#ct-chart-active-daily');//cumm active
    
        
        // console.log(daily_conf);
        //chart caption
        loadCaption(data);
        //update consolidate stats
        console.log(data.statewise[0].confirmed);
        document.getElementById('consolidated-stats-conf').innerText=data.statewise[0].confirmed;
        document.getElementById('consolidated-stats-recov').innerText=data.statewise[0].recovered;
        document.getElementById('consolidated-stats-dead').innerText=data.statewise[0].deaths;
        document.getElementById('consolidated-stats-active').innerText=data.statewise[0].active;
        //----------- Creating Statewise Object--------------//
        // console.log(data.statewise)
        var state = [[]]; //Object with keys as state and values as the array of active,recovered,confirmed and deceased
        for(i=0;i<data.statewise.length-1;i++)
        {
          state.push({"state":data.statewise[i].state,"confirmed":data.statewise[i].confirmed,"active":data.statewise[i].active,"recovered":data.statewise[i].recovered,"deceased":data.statewise[i].deaths});
        }
        // console.log(state[2].state)
        tableformation(state)
    }
}

xmlhttp.open("GET", url, true);
xmlhttp.send();
//------------END OF DATA FETCH--------------//
//------------------------------------------//

//--------------------------------------------//
//--------------CHART CAPTIONS---------------//
//------------------------------------------//

function loadCaption(data) {
    document.getElementById('cumm-conf-date').innerText=data.statewise[0].lastupdatedtime;
    document.getElementById('cumm-conf-value').innerText=data.statewise[0].confirmed+' cases';
    document.getElementById('cumm-dead-date').innerText=data.statewise[0].lastupdatedtime;
    document.getElementById('cumm-dead-value').innerText=data.statewise[0].deaths+' deaths';
    document.getElementById('cumm-recov-date').innerText=data.statewise[0].lastupdatedtime;
    document.getElementById('cumm-recov-value').innerText=data.statewise[0].recovered+' recovered';
    document.getElementById('cumm-active-date').innerText=data.statewise[0].lastupdatedtime;
    document.getElementById('cumm-active-value').innerText=data.statewise[0].active+' active';

    document.getElementById('daily-conf-date').innerText=data.cases_time_series[data.cases_time_series.length - 1].date;
    document.getElementById('daily-conf-value').innerText=data.cases_time_series[data.cases_time_series.length - 1].dailyconfirmed + ' cases';
    document.getElementById('daily-dead-date').innerText=data.cases_time_series[data.cases_time_series.length - 1].date;
    document.getElementById('daily-dead-value').innerText=data.cases_time_series[data.cases_time_series.length - 1].dailydeceased + ' deaths';
    document.getElementById('daily-recov-date').innerText=data.cases_time_series[data.cases_time_series.length - 1].date;
    document.getElementById('daily-recov-value').innerText=data.cases_time_series[data.cases_time_series.length - 1].dailyrecovered + ' recovered';
    document.getElementById('daily-active-date').innerText=data.cases_time_series[data.cases_time_series.length - 1].date;
    document.getElementById('daily-active-value').innerText=parseInt(data.cases_time_series[data.cases_time_series.length - 1].dailyconfirmed) - parseInt(data.cases_time_series[data.cases_time_series.length - 1].dailydeceased) - parseInt(data.cases_time_series[data.cases_time_series.length - 1].dailyrecovered);
    
    
}

//------------------------------------//
//--------------CHARTS---------------//
//----------------------------------//

//chart functions for line chart
function renderLineChart(label,data,id){
    var chartData = {
        labels: label,
        series: [
        data
        ]
    }

    var options = {
        height: '100%',
        width: '100%',
        low:0,
        showArea: true,
        plugins: [
            Chartist.plugins.tooltip()
          ],
        axisX: {
            labelInterpolationFnc: function(value, index) {

              return index % 5 === 0 ? '' + value : null;
            }
          }
    }
    var responsiveOptions = [
        ['screen and (max-width: 640px)', {
          axisX: {
            labelInterpolationFnc: function(value, index) {
              return index % 12 === 0 ? '' + value : null;
            }
          }
        }]
      ];
      console.log(id);
    var chart = new Chartist.Line(id, chartData, options, responsiveOptions);
    
    // Let's put a sequence number aside so we can use it in the event callbacks
    var seq = 0,
        delays = 20,
        durations = 1500;
    
    // Once the chart is fully created we reset the sequence
    

    
    // For the sake of the example we update the chart every time it's created with a delay of 10 seconds
    // chart.on('created', function() {
    //     if(window.__exampleAnimateTimeout) {
    //     clearTimeout(window.__exampleAnimateTimeout);
    //     window.__exampleAnimateTimeout = null;
    //     }
    //     // window.__exampleAnimateTimeout = setTimeout(chart.update.bind(chart), 5000);
    // });
}

//chart function for bar chart with peak points
// Create a simple bi-polar bar chart

function renderBarChartPeak(label,data,id){
    var chart = new Chartist.Bar(id, {
        labels: label,
        series: [
            data
        ]
      }, {
        height: '80%',
        low:0,
        plugins: [
            Chartist.plugins.tooltip()
          ],
        axisX: {
            labelInterpolationFnc: function(value, index) {
              return index % 7 === 0 ? '' + value : null;
            }
          }
      });
      
      // Listen for draw events on the bar chart
      chart.on('draw', function(data) {
        // If this draw event is of type bar we can use the data to create additional content
        if(data.type === 'bar') {
          // We use the group element of the current series to append a simple circle with the bar peek coordinates and a circle radius that is depending on the value
          data.group.append(new Chartist.Svg('circle', {
            cx: data.x2,
            cy: data.y2,
            r: Math.abs(Chartist.getMultiValue(2)) * 1.5
          }, 'ct-slice-pie'));
        }
      });
      
}

//--------------END OF CHARTS-----------------//
//-------------------------------------------//
//--------------END OF CHARTS---------------//


//---------------START OF TABLE FORMATION--------------//
function tableformation(state){
  // var tbody = document.getElementById('tbody');
  // for(i=2;i<state.lenght;i++)
  // {
  //   var tr = "<tr>";
  //   tr += "<th>" + state[i].state + "</th>" + "<td>$" + state[i].confirmed + "</td>" + "<td>$" + state[i].active + "</td>" + "<td>$" + state[i].recovered + "</td>" + "<td>$" + state[i].deceased + "</td></tr>";
  //   tbody.innerHTML += tr;
  // }
  var k = '<tbody>'
    for(i = 2;i < state.length; i++){
        k+= '<tr>';
        k+= "<th scope='row'>" + state[i].state + '</th>';
        k+= '<td>' + state[i].confirmed + '</td>';
        k+= '<td>' + state[i].active + '</td>';
        k+= '<td>' + state[i].recovered + '</td>';
        k+= '<td>' + state[i].deceased + '</td>';
        k+= '</tr>';
    }
    k+='</tbody>';
    document.getElementById('tbody').innerHTML = k;
}
