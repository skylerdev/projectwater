$('document').ready(function(){
          $('#global').ready(function(){
                var tab = "global";
                $.ajax ({
                    url : "score.php",
                    method : "GET",
                    data :  {tab: tab},
                    dataType: "text",
                    success:function(data){
                        var scores = jQuery.parseJSON(data);
                        $('#pipe-score').html(scores['pipe']);
                        
                        $('#shooter-score').html(scores['shooter']);
                    }
                });
            });
    
            $('#password').change(function(){
                $.ajax ({
                    url : "login.php",
                    method : "POST",
                    data :  $('form').serialize(),
                    dataType: "text",
                    success:function(response){
                        $('#errorMsg').html(response);
                    },
                    error:function(error){
                         $('#errorMsg').html('Password is incorrect');
                    }
                });
            });
            
   });