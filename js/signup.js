$('document').ready(function(){
          $('#username').change(function(){
               var username = $(this).val();
                $.ajax ({
                    url : "verify.php",
                    method : "POST",
                    data :  {username :username },
                    dataType: "text",
                    success:function(html){
                        if(html == 'false'){
                            $('#username').css('border','2px solid red');
                            $('#errorMsg').html('Username is taken');
                            $('#submit').attr('disabled',true);
                        } else {
                            
                            $('#username').css('border','2px solid #39ff14');
                            $('#errorMsg').html('');
                            $('#submit').attr('disabled',false);
                        }
                    }
                });
            });
          $('#email').keyup(function(){
               var email= $(this).val();
                $.ajax ({
                    url : "verify.php",
                    method : "POST",
                    data :  {email:email},
                    dataType: "text",
                    success:function(html) {
                        if(html == 'false'){
                            $('#email').css('border','2px solid red');
                            $('#errorMsg').html('Email is taken');
                            $('#submit').attr('disabled',true);
                        } else {
                            
                            $('#email').css('border','');
                            $('#errorMsg').html('');
                            $('#submit').attr('disabled',false);
                        }
                    }
                });
            });
            
            $('input[type=submit]').click(function(){
                makeCookie();
            })
    
    
   });