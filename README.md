# MyShare
Track your and your roommates expenses and calculate the share of each member.

# Tools

- Angular v6.0
- Firebase Database
- Firebase Functions
- Service Worker & manifest (PWA).

# UI 

Thanks for [Create Tim](https://www.creative-tim.com/), I used [Now UI Dashboard Angular](https://www.creative-tim.com/product/now-ui-dashboard-angular) free template.

# Installation

1. Clone the full repository.
2. Open **MyShare.firebase/.firebaserc**
3. Set value of **defualt** property with your firebase project name.  _if you don't have firebase project [here you can get started](https://firebase.google.com/docs/web/setup)_
4. Deploy firebase functions to your firebase project. _if you don't have firebase function [here you can get started](https://firebase.google.com/docs/functions/get-started)_
5. Open **MyShare.ng/src/environments/environment.< prod >.ts**
6. Set value of **fireFunctionsUrl** property with your firebase functions root url. _you can get it from output of step 4_ 
7. Build your project and test it. 
