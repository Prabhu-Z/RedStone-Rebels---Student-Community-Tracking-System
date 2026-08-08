import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FileCheck, Download, Calendar, ExternalLink } from 'lucide-react';

const CertificatesPage = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.studentId) return;
    const fetchCerts = async () => {
      try {
        const res = await api.get(`/certificates/student/${user.studentId}`);
        setCertificates(res.data);
      } catch (err) {
        console.error('Error fetching certificates:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, [user]);

  if (loading) return <LoadingSpinner label="Loading official certificates..." />;

  return (
    <div className="space-y-8 p-4 lg:p-8">
      <div>
        <h1 className="font-sans text-3xl font-extrabold text-slate-900">Official Verified Certificates</h1>
        <p className="text-xs text-slate-600 mt-1">Download official workshop completion, participation, and winner certificates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div key={cert.id} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 rounded-2xl border border-slate-100 space-y-4 hover:border-slate-200 transition">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-chestnut-700/30 border border-chestnut-500/30 flex items-center justify-center text-[#7c3aed]">
                <FileCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-600/20 text-[#7c3aed] border border-slate-200">
                {cert.certificateType}
              </span>
            </div>

            <div>
              <h3 className="font-sans text-lg font-bold text-slate-900">{cert.eventTitle || 'Community Certificate'}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Issued: {cert.issuedDate}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <a
                href={cert.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-200 text-[#8b5cf6] font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" /> Download Certificate
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificatesPage;
