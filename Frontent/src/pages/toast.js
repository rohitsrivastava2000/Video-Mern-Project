import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

export const notify=(result)=>{
    console.log(result)
    console.log(result.success);
    console.log(result.message);
    if(result.success){
        toast.success(result.message,{
            position:"top-left"
        });
    }
    else
     {
        toast.error(result.message,{
            position:"top-left"
        })
     }
}
