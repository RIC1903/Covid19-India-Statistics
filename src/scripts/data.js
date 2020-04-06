//Main Script file for handling data fetching and chart generation
//fetching data from covid19india api

var i;
var xmlhttp = new XMLHttpRequest();
var url = "https://api.covid19india.org/raw_data.json";

xmlhttp.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
        var data = JSON.parse(this.responseText).raw_data;
        var status = []; // array of unique current status
        for (i=0;i<data.length;i++){
            // if (status.indexOf(data[i].currentstatus) == -1){
                status.push(data[i].currentstatus);
            // }
        }
        console.log(status);
        var Hospitalized=0;
        var Recovered = 0;
        var Deceased=0;
        var Migrated =0;
        var count=0;
        for(i=0;i<status.length;i++){
            if(status[i] == "Hospitalized"){
                Hospitalized++;
            }
            else if(status[i] == "Recovered"){
                Recovered++;
            }
            else if(status[i] == "Deceased"){
                Deceased++;
            }
            else if(status[i] == "Migrated"){
                Migrated++;
            }else{
                count++;
            }
        }
        console.log(Hospitalized,Recovered,Deceased,Migrated,count)
    }
}

xmlhttp.open("GET", url, true);
xmlhttp.send();

//charts for above data