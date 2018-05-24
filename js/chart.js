$.ajax({
    type: 'GET',
    url:'chart.php',
    success: function(data){
        var obj = jQuery.parseJSON(data);


        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var data = google.visualization.arrayToDataTable(obj);

            var options = {
                title: 'Reservoirs',
                titleTextStyle: {
                                color: '#FFF',   
                                fontSize: 15,
                                //fontName: <string>, 
                                bold: true,
                                //italic: <boolean>
                                },
                hAxis: {title: 'Water Levels',  titleTextStyle: {color: '#FFF'},textStyle:{color: '#FFF',   
                                fontSize: 15}},
                vAxis: {minValue: 47, textStyle:{color: '#FFF',   
                                                 fontSize: 15}},
                backgroundColor: {fill:'transparent'},
                legend : {
                    textStyle:{
                        color: '#FFF',
                        fontSize: 15
                    }
                }
            };

            var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
            chart.draw(data, options);
        }
    }
})