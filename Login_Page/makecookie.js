function makeCookie() {
        var d = new Date();
        d.setTime(d.getTime() + (1*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = "username" + "=" + myForm.username.value + ";" + expires + ";path=/";
        document.cookie = "email" + "=" + myForm.email.value + ";" + expires + ";path=/";
      }