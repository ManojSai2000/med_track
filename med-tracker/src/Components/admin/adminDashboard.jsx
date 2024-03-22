import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { addAppointment, getAppointments } from "../service/appointmentService";
import AppointmentForm from "../service/appointmentForm";
import Calender from './appointmentsCalender';
import UsersList from './usersList';
import Break from './breaks';

import "../../style.css"

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);


    const scrollToSection = (sectionRef) => {
        sectionRef.current.scrollIntoView({ behavior: 'smooth' });
      };

    const fetchAppointments = async () => {
        try {
            const loadedAppointments = await getAppointments();
            setAppointments(loadedAppointments.map(appointment => ({
                title: `${appointment.departmentName} - ${appointment.doctorName}`,
                start: `${appointment.date}T${appointment.time}`,
            })));
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                await fetchAppointments();
            } catch (error) {
                console.error('Failed to fetch appointments:', error);
            }
        })();
    }, []);

    const handleSaveAppointment = async (appointmentData) => {
        console.log('Saving new appointment:', appointmentData);
        try {
            await addAppointment(appointmentData);
            await fetchAppointments();
        } catch (error) {
            console.error('Failed to save appointment:', error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div>
            <nav className='nav__bar'>
                <ul>
                    <li className='calender'> 
                    <button onClick={() => scrollToSection(section2Ref)}>Appointment Calender</button>
                    </li>
                    <li className='userlist'> 
                    <button onClick={() => scrollToSection(section3Ref)}>Users List</button>
                    </li>
                    <li><button onClick={handleSignOut}>Sign Out</button></li>
                </ul>
            </nav>

            <section className='main'>

            <h1>Admin Dashboard</h1>

            <div ref={section1Ref} className="section1">
            <AppointmentForm  onSaveAppointment={handleSaveAppointment} />
            </div>
            
            <div ref={section2Ref} className="section2">
            <Break/>
            <Calender events={appointments} ></Calender>
            </div>

            <div ref={section3Ref} className="section3">
            <Break/>
            <UsersList/>
            </div>

            </section>
            
        </div>
    );
};

export default AdminDashboard;