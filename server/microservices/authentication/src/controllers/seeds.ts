//create user seeds without sending verification message: 
import { Request, Response } from 'express';
import { AuthUserInterface, BadRequestError, ConflictError, CustomerDocumentInterface, FarmerDocumentInterface } from '@veckovn/growvia-shared';
import { getUserByUsername, createUser } from '@authentication/services/auth';
import { uniqueNamesGenerator, names, Config } from 'unique-names-generator';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';


export async function seedUsers(req:Request, res:Response):Promise<void>{
    const { type, count } = req.params;

    const usernameConfig:Config = {
        dictionaries: [names], // Only names
        separator: '', // No separator for a clean username
        length: 1, // Use only one name
        style: 'capital', // Capitalize the first letter
    };

    const generateUniqueUsername = () => {
        return uniqueNamesGenerator(usernameConfig) + Math.floor(1000 + Math.random() * 9000); // Add a random 4-digit number
    };

    for(let i = 0; i < parseInt(count); i++){

        const profilePublicId = uuidv4();
        const verificationToken = crypto.randomBytes(32).toString("hex");

        if(type !== 'customer' && type !== 'farmer')
            throw BadRequestError("Invalid user Type", "Authentication create user seeder function error");
        
        const userType = type;

        const createUserData: AuthUserInterface = {
            userType: userType,
            username: generateUniqueUsername(),
            password: 'seedPassword', //same password for everyone
            email: faker.internet.email(),
            cloudinaryProfilePublicId: profilePublicId,
            profilePicture: faker.image.urlPicsumPhotos(),
            verificationEmailToken: verificationToken,
        }

        let createSpecificUserData;

        const getValidLastName = (): string => {
            let lastName;
            do {
                lastName = faker.person.lastName(); //etc. Frami-Hoeger
            } while (lastName.includes('-')); // Regenerate if it contains a hyphen
            return lastName;
        };

        const firstName = faker.person.firstName(); 
        const lastName = getValidLastName();

        const generatedFullName = `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${
            lastName.charAt(0).toUpperCase() + lastName.slice(1)
        }`;

        const baseData = {
            username: createUserData.username!,
            email: createUserData.email!,
            profilePicture: createUserData.profilePicture!,
            fullName: generatedFullName, //First Upper Letter with "FirstName LastName" Structure
            //user specific type data 
            address: {
                country: faker.location.country(),
                city: faker.location.city(),
                address: faker.location.streetAddress()
            }
        }

        if(type === 'customer'){
            createSpecificUserData = {
                ...baseData,
                //other customer specific props
            } as CustomerDocumentInterface
        }
        else if (type === 'farmer'){
            createSpecificUserData = {
                ...baseData,
                farmName: faker.company.name(),
            } as FarmerDocumentInterface
        }
        else{
            throw BadRequestError("sa", "as");
        }

        const userExists = await getUserByUsername(createUserData.username!);
        if(userExists)
            throw ConflictError("User exist, cant be created again", "create/signup function error");
        
        await createUser(createUserData, createSpecificUserData);
    }

    res.status(200).json({message: 'User seeds successfully created'});
}