import type { NextPage } from 'next';

const OperationButtons: NextPage = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="flex-auto">
        <button className="bg-emerald-900 hover:bg-cyan-900 text-slate-50 font-bold py-2 px-4 rounded-full mx-2">
          Camera
        </button>
        <button className="bg-emerald-900 hover:bg-cyan-900 text-slate-50 font-bold py-2 px-4 rounded-full mx-2">
          Mike
        </button>
        <button className="bg-emerald-900 hover:bg-cyan-900 text-slate-50 font-bold py-2 px-4 rounded-full mx-2">
          Share
        </button>
        <button className="bg-emerald-900 hover:bg-cyan-900 text-slate-50 font-bold py-2 px-4 rounded-full mx-2">
          Record
        </button>
        <button className="bg-emerald-900 hover:bg-cyan-900 text-slate-50 font-bold py-2 px-4 rounded-full mx-2">
          Chat
        </button>
        <button className="bg-emerald-900 hover:bg-cyan-900 text-slate-50 font-bold py-2 px-4 rounded-full mx-2">
          Participant
        </button>
        <button className="bg-emerald-900 hover:bg-cyan-900 text-slate-50 font-bold py-2 px-4 rounded-full mx-2">
          Exit
        </button>
      </div>
    </div>
  );
};

export default OperationButtons;
