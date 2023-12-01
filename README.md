im not gonna lie to you
this project was probably too much to ask of me this week.
our entire cohort is behind by at least a day. 
im the only one remotely close to submitting.
but here i am, submitting. I know that my code could be cleaner,
i know that there are a few things id like to improve.
i would prefere to submit a functional, if imperfect product "on time" 
(okay, just over an hour past the deadline,) than submit a more refined product LATE.

I will continue to refine this and hope that i may submit an improved version for code review
if not for grading. Thanks for reading my ramble.

in the meantime:
  - this projects .JSON includes cookieParser which i have phased out in functionality. you do 
    not need it. 
  - many of my bits of test data may have residual silly values. I had to stay sane.
    you may find many butts. 
  - i am writing this README at 2:13 am, december first, 2023. I have an exam in 9 hours so 
    i will now submit this project and get as much sleep as i can. 

  - i have only just remembered that i have a dark mode extension on chrome. 
    Please do not be alarmed by differing colours, i just have sensitive eyes. 
    If this assignment included CSS website designing, you could also have a dark UI. 

cheers, and godspeed. 

### Please start at http://localhost:8080/login 

!["Screenshot of login page"](https://github.com/saintsappho/-tinyApp/tree/master/docs/login.png)

#You will have to register to make an account. This will also sign you in and redirect you to the "home" page at http://localhost:8080/urls 

!["Screenshot of URLS page"](https://github.com/saintsappho/-tinyApp/tree/master/docs/URLs_index.png)

#You can attempt to edit or delete one of the example links on this page, though you will find that you do not have the authority to view them. 

!["Screenshot of restricted access to edit page"](https://github.com/saintsappho/-tinyApp/tree/master/docs/restricted_access.png)

#This does not prevent you from visiting the link via longURL or the shortened URL.
Now that you are logged in, please select "Create New URL" from the nav bar. 
You should see a simple text input box. Please enter your full URL, including http:// or https:// as needed. 

!["Screenshot of new URL page"](https://github.com/saintsappho/-tinyApp/tree/master/docs/create_new.png)

#The tinyUrl will be randomly generated and assigned to your URL, and you will be redirected to the URLS homepage, where your new URL will be on display. You and only you will be able to edit it while logged in.

!["Screenshot of updated Index page"](https://github.com/saintsappho/-tinyApp/tree/master/docs/updated_index.png)

!["Screenshot of edit page for our very sleepy URL"](https://github.com/saintsappho/-tinyApp/tree/master/docs/edit_URL.png)

#please play around with logging out and trying to cheat the system. 
I believe i have plugged most of the holes. i am quite proud. 

#i am aware of a persistent serverResponse issue that reads thusly - 
Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client

#in attempting to resolve this i refactored my server and my templates down by a couple of 
hundred lines of code.
evidently this did not solve the concern. after some truly extensive testing i have confirmed that
this error has no impact on the effectiveness, UI, design, bugs, or consistency of my app and so i 
have elected to ignore it as i do not have the tools to fix it at this time. 

###Robin Out. 
2:47 am, december first, 2023.