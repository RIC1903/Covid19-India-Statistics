//Main Script file for handling data fetching and chart generation
//fetching data from covid19india api

var i;
var xmlhttp = new XMLHttpRequest();
var url = "https://api.covid19india.org/raw_data.json";

xmlhttp.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
        var data = JSON.parse(this.responseText).raw_data;
        var date = []; //dates of the cases found
	var num_of_cases = new Array(2); //2d aray with date,no.of.cases
        for (i=0;i<data.length;i++){
            if (date.indexOf(data[i].dateannounced) == -1){
                date.push(data[i].dateannounced);
            }
        }
        console.log(date);
        
        for (i=0;i<date.length; i++){
            num_of_cases[i] = new Array(2);
            num_of_cases[i][0]=date[i];
            num_of_cases[i][1]=0;
        }
        
        for (i=0;i<data.length;i++){
            var j = date.indexOf(data[i].dateannounced);
            for (var x = j; x<date.length; x++){
            num_of_cases[x][1]+=1;
            }
        }
        console.log(num_of_cases);
    }
}

xmlhttp.open("GET", url, true);
xmlhttp.send();

//charts for above data