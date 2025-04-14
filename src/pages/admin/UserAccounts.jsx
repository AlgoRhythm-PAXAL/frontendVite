import ImageUpload from '../../components/admin/ImageUpload/ImageUpload';
import SectionTitle from '../../components/admin/SectionTitle';

import UserRegistrationForm from '../../components/admin/UserRegistrationForm';



import UserTables from '../../components/admin/UserTables/UserTables';
import Modal from '../../components/admin/adminProfile/Modal';
import UserCount from "../../components/admin/userCounts/userCount";
import { Button } from "@/components/ui/button";
import { ImagePlus, Lock, Edit3, Save, X } from "lucide-react";
import {useState} from 'react'

const UserAccounts = () => {
  


  return (
    <div className="flex flex-col  mx-8  ">
      <SectionTitle title="User Accounts" />
      
      <div className="flex flex-col gap-5 w-full justify-center items-center">
       
        

        {/* <UserTable title="Admin" /> */}
        <UserCount />
        <UserRegistrationForm />




      </div>
      <UserTables />
      
    </div>
  );
};

export default UserAccounts;
