import config from '../config/aws';
import S3 from 'aws-sdk/clients/s3';
import { v4 as uuidv4 } from 'uuid';
import { extension } from 'mime-types';
import ProfileModel from '../models/Profile'
import TryCatchErrorDecorator from "../decorators/TryCatchErrorDecorator";
import { profile } from 'winston';

class UploadController {


    @TryCatchErrorDecorator
    static async saveProfile(req, res) {
        const s3 = new S3({
            accessKeyId: config.awsAccessKey,
            secretAccessKey: config.awsSecretKey
        });
        // console.log(req.files);
        // console.log(req.body);
        const profileModel = {}
        for (const key of Object.keys(req.files)) {

            const params = {
                Bucket: config.s3BucketName,
                Key: req.userId + '/' + uuidv4() + '.' + extension(req.files[key].mimetype), // File name you want to save as in S3
                Body: req.files[key].data
            };
            const path = await s3.upload(params).promise();
            console.log(path);
            profileModel[key + 'Path'] = path.Location;
        }
        profileModel.firstName = req.body.firstName;
        profileModel.lastName = req.body.lastName;
        profileModel.address2 = req.body.address2;
        profileModel.address1 = req.body.address1;
        profileModel.country = req.body.country;
        profileModel.city = req.body.city;
        profileModel.phone = req.body.phone;
        profileModel.type = req.body.type;
        profileModel.state = req.body.state;
        profileModel.userId = req.userId;


        const profile = new ProfileModel(profileModel);
        await profile.save();

        res.json({ status: "success" });
    }

    @TryCatchErrorDecorator
    static async findHistory(req, res) {
        const profileHistory = await ProfileModel.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(profileHistory);
    }


}

export default UploadController;
