import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import DoctorDashboard from '../Components/doctor/doctorDashboard';
import NurseDashboard from '../Components/nurse/nurseDashboard';
import { signOut } from 'firebase/auth';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  signOut: jest.fn(() => Promise.resolve()),
}));

const renderWithProviders = (ui, userType) => {
  const users = {
    doctor: { uid: 'doctor123' },
    nurse: { uid: 'nurse123' }
  };

  return render(
    <AuthContext.Provider value={{ currentUser: users[userType] }}>
      <BrowserRouter>{ui}</BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('Dashboard Tests', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    jest.clearAllMocks();
  });

  describe('DoctorDashboard', () => {
    it('renders correctly', () => {
      const { getByText } = renderWithProviders(<DoctorDashboard />, 'doctor');
      expect(getByText('Welcome to Doctor Dashboard')).toBeInTheDocument();
    });

    it('navigates to pending appointments on button click', () => {
      const { getByText } = renderWithProviders(<DoctorDashboard />, 'doctor');
      fireEvent.click(getByText('Pending Appointments'));
      expect(mockNavigate).toHaveBeenCalledWith('/doctorPendingAppointmentsView');
    });

    it('navigates to ontime appointments on button click', () => {
      const { getByText } = renderWithProviders(<DoctorDashboard />, 'doctor');
      fireEvent.click(getByText('OnTime Appointments'));
      expect(mockNavigate).toHaveBeenCalledWith('/doctorOntimeAppointments');
    });

    it('navigates to completed appointments on button click', () => {
      const { getByText } = renderWithProviders(<DoctorDashboard />, 'doctor');
      fireEvent.click(getByText('Completed Appointments'));
      expect(mockNavigate).toHaveBeenCalledWith('/doctorCompletedAppointments');
    });

    it('calls sign out process on "Log Out" button click', async () => {
      const { getByText } = renderWithProviders(<DoctorDashboard />, 'doctor');
      fireEvent.click(getByText('Log Out'));
      await expect(signOut).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('NurseDashboard', () => {
    it('renders correctly', () => {
      const { getByText } = renderWithProviders(<NurseDashboard />, 'nurse');
      expect(getByText('Welcome to Nurse Dashboard')).toBeInTheDocument();
    });

    it('navigates to pending appointments on button click', () => {
      const { getByText } = renderWithProviders(<NurseDashboard />, 'nurse');
      fireEvent.click(getByText('Pending Appointments'));
      expect(mockNavigate).toHaveBeenCalledWith('/nurseAppointmentsView');
    });

    it('navigates to accepted appointments on button click', () => {
      const { getByText } = renderWithProviders(<NurseDashboard />, 'nurse');
      fireEvent.click(getByText('Accepted Appointments'));
      expect(mockNavigate).toHaveBeenCalledWith('/nurseAcceptedAppointmentsView');
    });

    it('navigates to equipment appointments on button click', () => {
      const { getByText } = renderWithProviders(<NurseDashboard />, 'nurse');
      fireEvent.click(getByText('Edit Equipment Appointments'));
      expect(mockNavigate).toHaveBeenCalledWith('/nurseEditEquipmentBookings');
    });

    it('calls sign out process on "Log Out" button click', async () => {
      const { getByText } = renderWithProviders(<NurseDashboard />, 'nurse');
      fireEvent.click(getByText('Log Out'));

      await waitFor(() => {
        expect(signOut).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });
});