import { useState } from 'react';
import Dashboard from './Dashboard';
import ActionPlan from './ActionPlan';
import MockInterview from './MockInterview';
import Certification from './Certification';
import ResumeTip from './ResumeTip';

function Home() {
    const [selected, setSelected] = useState('dashboard');

    function renderContent() {
        if (selected === 'dashboard') return <Dashboard />;
        if (selected === 'action-plan') return <ActionPlan />;
        if (selected === 'mock-interview') return <MockInterview />;
        if (selected === 'certification') return <Certification />;
        if (selected === 'resume-tip') return <ResumeTip />;
    }

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '250px', borderRight: '1px solid black' }}>
                <h3>Sidebar</h3>
                <button onClick={() => setSelected('dashboard')}>Dashboard</button><br />
                <button onClick={() => setSelected('action-plan')}>7 Day Action Plan</button><br />
                <button onClick={() => setSelected('mock-interview')}>Mock Interview</button><br />
                <button onClick={() => setSelected('certification')}>Certification</button><br />
                <button onClick={() => setSelected('resume-tip')}>Resume Tips</button>
            </div>
            <div style={{ padding: '20px' }}>
                {renderContent()}
            </div>
        </div>
    );
}

export default Home;