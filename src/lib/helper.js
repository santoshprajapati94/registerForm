
export const AgeCount = (dob)=>{
    const date = new Date(dob);
     const today = new Date();
     const age = today.getFullYear() - date.getFullYear();
     return String(age);
    
}


export const GetState = async()=>{
    try{
        const response = await fetch("https://dev01-api.ehrlogic.com/api/v1/address/state");
        const result = await response.json();
        const stateData = result.data;
        if(stateData){
            return stateData;
        }
    }
    catch(e){
        console.log('getting Error',e)
    }
}


export const GetDistrict = async(state)=>{
    try{
        const response = await fetch(`https://dev01-api.ehrlogic.com/api/v1/address/district/${state}`);
        const result = await response.json();
        const DistrictData = result
        if(DistrictData){
            return DistrictData;
        }
    }
    catch(e){
        console.log('getting Error',e)
    }
}


export const GetPinCode = async(PinCode)=>{
    try{
        const res = await fetch(`https://api.postalpincode.in/pincode/${PinCode}`)
        const data = await res.json();

        if(!res.ok) {
            throw new Error('Something went wrong...')
        }

        return data[0]['PostOffice'][0]
    }
    catch(e){
        console.log('getting Error',e)
    }
}