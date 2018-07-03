import { ServicesUnit } from "../../services/unit.services";
import { IUser } from "../../shared/interfaces";

export class RegisterModel {
    constructor(private services: ServicesUnit) {

    }

    register(phone: string, user: IUser) {
        this.services.spinner.show();


        this.services.angularFirebaseService.register(phone, user)
            .then(result => {
                if (result) {
                    this.services.spinner.hide();
                    localStorage.setItem("id", phone);
                    localStorage.setItem("name", user.name);
                    this.services.route.navigate(["/"]);
                }
                else {
                    this.services.spinner.hide();
                    this.services.toastrSevice.error('phone number is regsitered before');
                }
            })
            .catch((error) => {
                this.services.spinner.hide();
                this.services.toastrSevice.error(error._body);
            });
    }
}