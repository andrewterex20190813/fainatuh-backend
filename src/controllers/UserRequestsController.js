import UserRequestModel from "../models/UserRequest";
import TryCatchErrorDecorator from "../decorators/TryCatchErrorDecorator";

import webpush from 'web-push';

class UsersController {
    @TryCatchErrorDecorator
    static async getAll(req, res) {
        const userRequests = await UserRequestModel.find();

        res.json(userRequests);
    }

    @TryCatchErrorDecorator
    static async getById(req, res) {
        const userRequest = await UserRequestModel.findById(req.params.id);
        if(!userRequest) {
            return res.sendStatus(404);
        }
        
        res.json(userRequest);
    }

    @TryCatchErrorDecorator
    static async create(req, res) {
        const userRequest = new UserRequestModel({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            state: req.body.state
        });

        await userRequest.save();

        // notification
        const subscription = userRequest;
        console.log(subscription)

        const payload = JSON.stringify({
            title: 'Hello!',
            body: 'It works.',
        })

        webpush.sendNotification(subscription, payload)
            .then(result => console.log(result))
            .catch(e => console.log(e.stack))

        res.json({ status: "success" });
    }

    @TryCatchErrorDecorator
    static async update(req, res) {
            var userRequest = await UserRequestModel.findById(req.params.id);
            if(!userRequest) {
                return res.sendStatus(404);
            }
            
            console.log(req.body);
            if (typeof req.body.state != undefined) {
                userRequest.state = req.body.state;
            }

            await userRequest.save();

            res.json({ status: "success" });
    }
}

export default UsersController;
