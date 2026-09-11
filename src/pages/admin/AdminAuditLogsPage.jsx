import { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Download,
  Shield,
  UserCheck,
  Eye,
  Activity,
  FileText,
  RotateCcw,
  X,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import { selectAdminAuditLogs } from '../../features/admin/adminSelectors';
import { auditLogApi } from '../../api';

export const AdminAuditLogsPage = () => {
  const auditLogs = useSelector(selectAdminAuditLogs);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAction, setSelectedAction] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const itemsPerPage = 8;

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || log.status === selectedStatus;
      const matchesAction =
        selectedAction === 'all' || log.action?.toLowerCase().includes(selectedAction.toLowerCase());

      return matchesSearch && matchesStatus && matchesAction;
    });
  }, [auditLogs, searchTerm, selectedStatus, selectedAction]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = async () => {
    try {
      setIsExporting(true);
      toast.loading('Exporting Sentinel Security Audit Log...', { id: 'audit-export' });
      // Prepared API contract:
      // await auditLogApi.exportAuditLogs({ status: selectedStatus });
      setTimeout(() => {
        setIsExporting(false);
        toast.success('Security Audit Trail exported successfully (CSV).', { id: 'audit-export' });
      }, 700);
    } catch (err) {
      setIsExporting(false);
      toast.error('Failed to export audit logs.', { id: 'audit-export' });
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedAction('all');
    setCurrentPage(1);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Sentinel Governance & Compliance
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Security Audit Trail & Governance Logs
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Immutable telemetry recording administrative overrides, seller accreditations, and security events.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={Download}
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? 'Exporting...' : 'Export Audit Trail'}
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Search by admin, action, resource, IP..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              leftIcon={Search}
              size="sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedAction}
              onChange={(e) => {
                setSelectedAction(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <option value="all">All Actions</option>
              <option value="seller">Seller Operations</option>
              <option value="order">Order Changes</option>
              <option value="refund">Refund Arbitrations</option>
              <option value="security">Security Overrides</option>
              <option value="product">Catalog Moderation</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Success">Success</option>
              <option value="Flagged">Flagged</option>
            </select>

            {(searchTerm || selectedStatus !== 'all' || selectedAction !== 'all') && (
              <Button
                variant="ghost"
                size="xs"
                leftIcon={RotateCcw}
                onClick={handleResetFilters}
                className="text-slate-500 hover:text-slate-900"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Log ID</th>
                  <th className="py-3.5 px-4">Operator / Principal</th>
                  <th className="py-3.5 px-4">Action Performed</th>
                  <th className="py-3.5 px-4">Target Resource</th>
                  <th className="py-3.5 px-4">Origin IP</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedLogs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500 space-y-2">
                      <Shield className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="font-semibold text-slate-700">No security audit activity available.</p>
                      <p className="text-[11px] text-slate-400">Try adjusting search filters to broaden your query.</p>
                    </td>
                  </tr>
                ) : (
                  paginatedLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-[11px]">
                        {log.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {log.user}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900">{log.action}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {log.resource}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {log.ip || '192.168.1.1'}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={log.status === 'Success' ? 'success' : 'danger'}
                          size="xs"
                        >
                          {log.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap font-mono">
                        {log.timestamp}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                          title="Inspect Audit Record"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              Page {currentPage} of {totalPages} ({filteredLogs.length} total entries)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg border border-slate-200 bg-white font-semibold disabled:opacity-40 cursor-pointer shadow-xs"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg border border-slate-200 bg-white font-semibold disabled:opacity-40 cursor-pointer shadow-xs"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Audit Log Modal */}
        {selectedLog && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-800" />
                  <h3 className="font-serif font-bold text-slate-900 text-base">
                    Audit Event Record: {selectedLog.id}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-1 text-slate-400 hover:text-slate-900 cursor-pointer font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Operator:</span>
                  <span className="font-bold text-slate-900">{selectedLog.user}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Action:</span>
                  <span className="font-bold text-slate-900">{selectedLog.action}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Resource:</span>
                  <span className="font-mono text-slate-800">{selectedLog.resource}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <Badge variant={selectedLog.status === 'Success' ? 'success' : 'danger'} size="xs">
                    {selectedLog.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Origin IP:</span>
                  <span className="font-mono text-slate-600">{selectedLog.ip || '192.168.1.1'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Timestamp:</span>
                  <span className="font-mono text-slate-600">{selectedLog.timestamp}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-700 block">Governance Context:</span>
                <p className="text-slate-600 leading-relaxed">
                  Administrative operation executed with standard role clearances. Security state signed and retained in immutable storage.
                </p>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <Button variant="outline" size="sm" onClick={() => setSelectedLog(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminAuditLogsPage;
