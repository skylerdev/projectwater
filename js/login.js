$('document').ready(function(){
          $('#username').change(function(){
               var username = $(this).val();
                $.ajax ({
                    url : "verify.php",
                    method : "POST",
                    data :  {username :username },
                    dataType: "text",
                    success:function(html){
                        if(html != 'false'){
                            $('#username').css('border','2px solid red');
                            $('#errorMsg').html('Username doesn\'t exist </br>');
                            $('#submit').attr('disabled',true);
                        } else {
                            $('#username').css('border','');
                            $('#errorMsg').html('');
                            $('#submit').attr('disabled',false);
                        }
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