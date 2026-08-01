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
        <h1 className="font-serif text-3xl font-extrabold text-white">Official Verified Certificates</h1>
        <p className="text-xs text-stardustsilver-300/70 mt-1">Download official workshop completion, participation, and winner certificates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div key={cert.id} className="glass-card p-6 rounded-2xl border border-stardustsilver-300/15 space-y-4 hover:border-warmgold-500/30 transition">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-chestnut-700/30 border border-chestnut-500/30 flex items-center justify-center text-warmgold-400">
                <FileCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-warmgold-500/20 text-warmgold-400 border border-warmgold-500/30">
                {cert.certificateType}
              </span>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-white">{cert.eventTitle || 'Community Certificate'}</h3>
              <p className="text-xs text-stardustsilver-300/60 font-mono mt-0.5">Issued: {cert.issuedDate}</p>
            </div>

            <div className="pt-3 border-t border-stardustsilver-300/15 flex items-center justify-between">
              <a
                href={cert.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-warmgold-500/20 hover:bg-warmgold-500/30 border border-warmgold-500/40 text-warmgold-300 font-bold text-xs flex items-center justify-center gap-2 transition"
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
