import { FC, ReactElement } from 'react'; 
import { DeliveryDetailsFormPropsInterface } from '../../order.interface';
import TextField from '../../../shared/inputs/TextField';

const DeliveryDetailsForm:FC<DeliveryDetailsFormPropsInterface> = ({orderData, validationErrorData, handleChange}):ReactElement => {

    console.log("alidatioNerrorData: ", validationErrorData);
    
    const getFieldError = (fieldName: string) => validationErrorData[fieldName];

    const getBorderErrorStyle = (field: string): string =>{
        // if(actionError || getFieldError(field))
        if(getFieldError(field))
            return 'border-0 border-b-4 border-red-400';
        else
            return '';
    }


    return (
        <div className="max-w-[512px] mx-auto pt-2 pb-10 mb px-4 sm:px-6 border-2 border-greyB bg-greyOrder rounded bg-red-300a">
            <h3 className="sm:text-xl font-semibold mb-3 font-lato">Delivery Details</h3>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 ">
                <div className="w-full sm:w-1/2">
                    <label htmlFor="firstName" className="text-sm sm:text-base font-medium text-gray-700">
                        First Name
                    </label>
                    <TextField
                        className={`
                            w-full p-2 pl-4 text-sm sm:text-base border-2 border-greyB rounded-md shadow-sm 
                            focus:border-green2 focus:border-4
                            ${getBorderErrorStyle('firstName')}
                        `}
                        id="firstName" //match label htmlFor 
                        value={orderData.firstName}
                        name="firstName"
                        type="text"
                        placeholder='Enter First Name'
                        // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{
                        //     setUserInfo({ ...userInfo, firstName: e.target.value})
                        // }}
                        onChange={handleChange}

                    />
                    {validationErrorData.firstName &&
                        <label className='text-red-600 text-sm'> {validationErrorData.firstName}</label>
                    }
                </div>
                <div className="w-full sm:w-1/2">
                    <label htmlFor="lastName" className="text-sm sm:text-base font-medium text-gray-700">
                        Last Name
                    </label>
                    <TextField
                        className={`
                            w-full p-2 pl-4 text-sm sm:text-base border-2 border-greyB rounded-md shadow-sm 
                            focus:border-green2 focus:border-4
                            ${getBorderErrorStyle('lastName')}
                        `}
                        id="lastName" //match label htmlFor 
                        value={orderData.lastName}
                        name="lastName"
                        type="text"
                        placeholder="Enter Last Name"
                        onChange={handleChange}
                    />
                    {validationErrorData.lastName &&
                        <label className='text-red-600 text-sm'> {validationErrorData.lastName}</label>
                    }  
                </div>
            </div>

            <div className="w-full my-2 sm:my-4 ">
                <label htmlFor="address" className="text-sm sm:text-base font-medium text-gray-700">
                Address
                </label>
                <TextField
                    className={`
                        w-full p-2 pl-4 text-sm sm:text-base border-2 border-greyB rounded-md shadow-sm 
                        focus:border-green2 focus:border-4
                        ${getBorderErrorStyle('address')}
                    `}
                    id="address"
                    value={orderData.address}
                    name="address"
                    type="text"
                    placeholder="Enter Address"
                    onChange={handleChange}
                />
                {validationErrorData.address &&
                    <label className='text-red-600 text-sm'>{validationErrorData.address}</label>
                }
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 ">
                <div className="w-fulla w-1/2 sm:w-1/2">
                    <label htmlFor="city" className="text-sm sm:text-base font-medium text-gray-700">
                        City
                    </label>
                    <TextField
                        className={`
                            w-full p-2 pl-4 text-sm sm:text-base border-2 border-greyB rounded-md shadow-sm 
                            focus:border-green2 focus:border-4
                            ${getBorderErrorStyle('city')}
                        `}
                        id="city" //match label htmlFor 
                        value={orderData.city}
                        name="city"
                        type="text"
                        placeholder='Enter City'
                        // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{
                        //     setUserInfo({ ...userInfo, firstName: e.target.value})
                        // }}
                        onChange={handleChange}
                    />
                    {validationErrorData.city &&
                        <label className='text-red-600 text-sm'> {validationErrorData.city}</label>
                    }
                </div>
                <div className="w-1/2 min-w-[200px] sm:w-1/2">
                    <label htmlFor="postCode" className="text-sm sm:text-base font-medium text-gray-700">
                        Post Code
                    </label>
                    <TextField
                        className={`
                            w-full p-2 pl-4 text-sm sm:text-base border-2 border-greyB rounded-md shadow-sm 
                            focus:border-green2 focus:border-4
                            ${getBorderErrorStyle('postCode')}
                        `}
                        id="postCode" //match label htmlFor 
                        value={orderData.postCode}
                        name="postCode"
                        type="text"
                        placeholder="Enter Post Code"
                        onChange={handleChange}
                    />
                    {validationErrorData.postCode &&
                        <label className='text-red-600 text-sm'> {validationErrorData.postCode}</label>
                    }  
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 my-2 sm:my-4">
                <div className="w-1/2 min-w-[200px] sm:w-1/2">
                    <label htmlFor="phone" className="text-sm sm:text-base font-medium text-gray-700">
                        Phone
                    </label>
                    <TextField
                        className={`
                            w-full p-2 pl-4 text-sm sm:text-base border-2 border-greyB rounded-md shadow-sm 
                            focus:border-green2 focus:border-4
                            ${getBorderErrorStyle('phone')}
                        `}
                        id="phone" //match label htmlFor 
                        value={orderData.phone}
                        name="phone"
                        type="text"
                        placeholder='Enter Phone Number'
                        // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{
                        //     setUserInfo({ ...userInfo, firstName: e.target.value})
                        // }}
                        onChange={handleChange}
                    />
                    {validationErrorData.phone &&
                        <label className='text-red-600 text-sm'> {validationErrorData.phone}</label>
                    }
                </div>
                <div className="w-1/2a w-full min-w-[200px] sm:w-1/2 ">
                    <label htmlFor="email" className="text-sm sm:text-base font-medium text-gray-700">
                        Email
                    </label>
                    <TextField
                        className={`
                            w-full p-2 pl-4 text-sm sm:text-base border-2 border-greyB rounded-md shadow-sm 
                            focus:border-green2 focus:border-4
                            ${getBorderErrorStyle('email')}
                        `}
                        id="email" //match label htmlFor 
                        value={orderData.email}
                        name="email"
                        type="text"
                        placeholder="Enter Email"
                        onChange={handleChange}
                    />
                    {validationErrorData.email &&
                        <label className='text-red-600 text-sm'> {validationErrorData.email}</label>
                    }  
                </div>
            </div>
        </div>
    )
}

export default DeliveryDetailsForm;