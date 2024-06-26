import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Bank from "../images/bank-active.png";
import Tent from "../images/tent-active.png";
import { AgeCount } from "../lib/helper";
import { GetState } from "../lib/helper";
import { GetDistrict } from "../lib/helper";
import { GetPinCode } from "../lib/helper";
import "../styles/Doner.css";
import * as yup from "yup";

const schema = yup.object().shape({
  bloodBankCampName: yup.string().nullable(),
  donationType: yup.string().nullable(),
  donationDate: yup.date().nullable(),
  aadhaar: yup
    .string()
    .matches(/^\d{12}$/, "Aadhaar must be 12 digits")
    .nullable(),
  name: yup.string().required("Name is required"),
  fatherName: yup.string().required("Father/Husband's Name is required"),
  relation: yup.string().required("Relation is required"),
  mobile: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[0-9]{10}$/, "Mobile number is not valid"),
  email: yup.string().email("Email is not valid").nullable(),
  gender: yup.string().required("Gender is required"),
  dob: yup.date().nullable(),
  age: yup.string().required("Age is required"),
  maritalStatus: yup.string().nullable(),
  address: yup.string().nullable(),
  state: yup.string().required("State is required"),
  district: yup.string().required("District is required"),
  city: yup.string().required("City/Village is required"),
  pinCode: yup.string().nullable(),
  consentSms: yup.bool().oneOf([true], "Consent to send SMS is required"),
  consentCall: yup.bool().oneOf([true], "Consent to call is required"),
});
let cityData = "";
const DonerForm = () => {
  const [stateApi, setStateApi] = useState([]);
  const [districtApi, setDistrictApi] = useState([]);
  const[bloodBank , setBloodBank] = useState(1);
  const[bloodCamp , setBloodCamp] = useState(0);


  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    const donationdate = `${year}-${month}-${day}`;
    return donationdate;
  };

  const defaultValues = {
    bloodBankCampName: "",
    donationType: "Voluntary Doner",
    donationDate: getCurrentDate(),
    aadhaar: "",
    name: "",
    fatherName: "",
    relation: "",
    mobile: "",
    email: "",
    gender: "male",
    dob: "",
    age: "",
    maritalStatus: "Prefer not to say",
    address: "",
    state: "Select State",
    district: "Select District",
    city: "",
    pinCode: "",
    consentSms: true,
    consentCall: true,
  };

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const fetchDistrict = async () => {
    const { data } = await GetDistrict(watch('state'));
    console.log(`districts`, data);
    setDistrictApi(data);
  };

  useEffect(() => {
    const dob = watch("dob");
    if (dob) {
      const age = AgeCount(dob);
      setValue("age", age);
    }
  }, [watch("dob")]);
  //--------- state component ---------//
  useEffect(() => {
    const fetchStates = async () => {
      const states = await GetState();
      setStateApi(states);
    };
    fetchStates();
  }, []);

  // -----pincode ------//
  useEffect(() => {
    const fetchPinCode = async () => {
      const code = watch("pinCode");
      if (code.length === 6) {
        const address = await GetPinCode(code);
        //console.log(`state & dis `, State);
        setValue("state",address?.State);
        //  await GetDistrict(State);
        cityData = address?.District;
        console.log('district data =>',cityData)
        setValue("district", cityData);
        setValue('city',address.District)
      }
    };
    fetchPinCode();
  }, [watch("pinCode")]);

  useEffect(() => {
    if(cityData) {
      setValue('district', cityData)
    }
  }, [watch('pinCode')]);
 
  useEffect(() => {
    const state = watch("state");
    console.log(state);
    if (state){
      fetchDistrict();
      setValue("district",cityData)
    }
  }, [watch("state")]);

  const onSubmit = (data) => {
    console.log({ data });
    localStorage.setItem("data",JSON.stringify(data));
    reset();
  };
  // console.log(districtApi);

  const handleBloodBank =()=>{
    setBloodBank(1)
    setBloodCamp(0);
    console.log('clicked1')
  }
  const handleBloodCamp = ()=>{
    setBloodCamp(1);
    setBloodBank(0);
    console.log('clicked')
  }
  return (
    <>
      <div className="doner-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="doner-types">
            <div className="types-wrapper">
              <div className={` ${bloodBank === 0 ? 'types-img' : 'img-active' }`}  onClick={()=> handleBloodBank()}>
                <img src={Bank} alt="bank" className={` ${bloodBank === 0 ? 'image' : 'img1' }`} />
                <p>Blood Bank</p>
              </div>
              <div className={` ${bloodCamp === 0 ? 'types-img' : 'img-active' }`} id="bloodCamp" onClick={()=>handleBloodCamp()}>
                <img src={Tent} className={` ${bloodBank === 0 ? 'img1' : 'image' }`} alt="bank" />
                <p>Blood Camp</p>
              </div>
            </div>
          </div>
          <div className="donation">
            <div className="form-inp">
              <label htmlFor="">Blood Bank/Camp Name</label>
              <input
                type="text"
                {...register("bloodBankCampName")}
                placeholder={bloodCamp === 0 ? 'HG BLOOD BANK88' : 'Enter Camp Name' }
              />
              {errors.bloodBankCampName && (
                <p className="danger">{errors.bloodBankCampName.message}</p>
              )}
            </div>
            <div className="form-inp">
              <label htmlFor="donation-type">Donation Type</label>
              <select
                {...register("donationType")}
                className="donation-type"
                id="donation-type"
              >
                <option value="Voluntary Doner">Voluntary Doner</option>
                <option value="Replacement Doner">Replacement Doner</option>
                <option value="Autologous Doner">Autologous Doner</option>
              </select>
              {errors.donationType && (
                <p className="danger">{errors.donationType.message}</p>
              )}
            </div>
          </div>
          <h4>Personal Details</h4>
          <div className="Personal-details">
            <div className="form-inp">
              <label htmlFor="donationDate">Donation Date</label>
              <input
                type="date"
                {...register("donationDate")}
                id="donationDate"
              />
            </div>
            <div className="form-inp">
              <label htmlFor="aadhaar">Enter Aadhaar</label>
              <input
                type="text"
                {...register("aadhaar")}
                placeholder="Enter Aadhaar Number"
                id="aadhaar"
              />
              {errors.aadhaar && (
                <p className="danger">{errors.aadhaar.message}</p>
              )}
            </div>
            <div className="form-inp">
              <label htmlFor="name">
                Enter Your Name<span className="danger"> * </span>{" "}
              </label>
              <input
                type="text"
                {...register("name")}
                placeholder="Doner Name"
                id="name"
              />
              {errors.name && <p className="danger">{errors.name.message}</p>}
            </div>
            <div className="form-inp">
              <label htmlFor="fatherName">
                Father/Husband's Name <span className="danger">*</span>
              </label>
              <input
                type="text"
                {...register("fatherName")}
                placeholder="Father/Husband's Name"
                id="fatherName"
              />
              {errors.fatherName && (
                <p className="danger">{errors.fatherName.message}</p>
              )}
            </div>
            <div className="form-inp">
              <label htmlFor="relation">
                Relation <span className="danger">*</span>
              </label>
              <div className="radio-box">
                <div className="radio-btn" id="relation">
                  <input
                    type="radio"
                    id="father"
                    value="father"
                    {...register("relation")}
                  />
                  <label  className={`radio-label ${watch('relation') === 'father' ? "checked" : "unchecked"}`} htmlFor="father">
                    Father
                  </label>
                </div>
                <div className="radio-btn">
                  <input
                    type="radio"
                    id="husband"
                    value="husband"
                    {...register("relation")}
                  />
                  <label htmlFor="husband" className={`radio-label ${watch('relation')==='husband' ? "checked" : 'unchecked'}`}>
                    Husband
                  </label>
                </div>
              </div>
            </div>
            <div className="form-inp">
              <label htmlFor="mobile">
                Mobile <span className="danger">*</span>
              </label>
              <input
                type="number"
                {...register("mobile")}
                placeholder="Doner Mobile"
                id="mobile"
              />
              {errors.mobile && (
                <p className="danger">{errors.mobile.message}</p>
              )}
            </div>
            <div className="form-inp">
              <label htmlFor="email">Enter Email</label>
              <input
                type="email"
                {...register("email")}
                placeholder="Doner Email Id"
                id="email"
              />
              {errors.email && <p className="danger">{errors.email.message}</p>}
            </div>
            <div className="form-inp">
              <label htmlFor="gender">
                Gender <span className="danger">*</span>
              </label>
              <div className="radio-box" id="gender">
                <div className="radio-btn">
                  <input
                    type="radio"
                    id="male"
                    value="male"
                    {...register("gender")}
                  />
                  <label className={`radio-label ${watch('gender')==='male' ? "checked" : 'unchecked'}`} htmlFor="male">
                    Male
                  </label>
                </div>
                <div className="radio-btn">
                  <input
                    type="radio"
                    id="female"
                    value="female"
                    {...register("gender")}
                  />
                  <label className={`radio-label ${watch('gender')==='female' ? "checked" : 'unchecked'}`} htmlFor="female">
                    Female
                  </label>
                </div>
                <div className="radio-btn">
                  <input
                    type="radio"
                    id="other"
                    value="other"
                    {...register("gender")}
                  />
                  <label className={`radio-label ${watch('gender')==='other' ? "checked" : 'unchecked'}`} htmlFor="other">
                    Other
                  </label>
                </div>
              </div>
              {errors.gender && <p>{errors.gender.message}</p>}
            </div>
            <div className="form-inp">
              <label htmlFor="dob">Date of Birth</label>
              <input type="date" {...register("dob")} id="dob" />
              {errors.dob && <p className="danger">{errors.dob.message}</p>}
            </div>
            <div className="form-inp">
              <label htmlFor="age">
                Age <span className="danger">*</span>
              </label>
              <input
                type="text"
                {...register("age")}
                placeholder="Age"
                id="age"
              />
              {errors.age && <p className="danger">{errors.age.message}</p>}
            </div>
            <div className="form-inp">
              <label htmlFor="maritalStatus">Marital Status</label>
              <select
                {...register("maritalStatus")}
                className="donation-type"
                id="maritalStatus"
              >
                <option value="Prefer not to say">Prefer not to say</option>
                <option value="Married">Married</option>
                <option value="Unmarried">Unmarried</option>
              </select>
            </div>
          </div>
          <h4>Contact Information</h4>
          <div className="Contact-information">
            <div className="form-inp">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                {...register("address")}
                placeholder="Enter Address Line 1"
                id="address"
              />
              {errors.address && (
                <p className="danger">{errors.address.message}</p>
              )}
            </div>
            <div className="form-inp">
              <label htmlFor="state">
                State
                <span className="danger">*</span>
              </label>
              <select
                {...register("state")}
                className="donation-type"
                id="state"
              >
                <option value="Select State">Select State</option>
                {stateApi && stateApi.length
                  ? stateApi.map((item, id) => {
                      return (
                        <option value={item.name} key={id}>
                          {item.name}
                        </option>
                      );
                    })
                  : null}
              </select>
              {errors.state && <p className="danger">{errors.state.message}</p>}
            </div>
            <div className="form-inp">
              <label htmlFor="district" name='district'>
                District
                <span className="danger">*</span>
              </label>
              <select
                {...register("district")}
                className="donation-type"
                id="district"
                name="district"
              >
                <option value="Select District">Select District</option>
                {districtApi && districtApi.length
                  ? districtApi.map((item, id) => {
                      return (
                        <option value={item.name} name={item.name} key={id}>
                          {item.name}
                        </option>
                      );
                    })
                  : null}
              </select>
              {errors.state && <p className="danger">{errors.state.message}</p>}
            </div>
            <div className="form-inp">
              <label htmlFor="village">
                City/Village <span className="danger">*</span>
              </label>
              <input
                {...register("city")}
                type="text"
                name="city"
                id="city"
                placeholder="Enter City"
              />
              {errors.village && (
                <p className="danger">{errors.village.message}</p>
              )}
            </div>
            <div className="form-inp">
              <label htmlFor="pinCode">Pin Code</label>
              <input
                {...register("pinCode")}
                type="text"
                name="pinCode"
                id="pinCode"
                placeholder="Enter Pin Code"
              />
              {errors.pinCode && (
                <p className="danger">{errors.pinCode.message}</p>
              )}
            </div>
          </div>
          <h4>Donor consent</h4>
          <div className="Donor-consent">
            <div className="form-check">
              <label className="consent" htmlFor="consentSms">
                Consent to send sms
              </label>
              <input
                {...register("consentSms")}
                className="doner-check"
                type="checkbox"
                id="consentSms"
                name="consent"
              />
            </div>
            <div className="form-check">
              <label className="consent" htmlFor="consentCall">
                Consent to call
              </label>
              <input
                {...register("consentCall")}
                className="doner-check"
                type="checkbox"
                id="consentCall"
                name="consent"
              />
            </div>
          </div>
          <div className="btn-doner">
            <button className="cancle-btn" type="reset">
              Cancle
            </button>
            <button className="submit-btn" type="submit">
              Register
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default DonerForm;
