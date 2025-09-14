import { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Download, 
  RefreshCw, 
  Lock, 
  Unlock, 
  UserCheck, 
  UserX,
  Activity,
  BarChart3,
  FileText,
  Clock,
  Users,
  Key
} from 'lucide-react';
import { useSecurityAudit } from '../../lib/security/audit-logger';
import { SecurityEventType } from '../../lib/security/audit-logger';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

export function SecurityDashboard() {
  const { getSecurityStatistics, exportSecurityEvents } = useSecurityAudit();
  const [stats, setStats] = useState<any>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadSecurityStats();
  }, []);

  const loadSecurityStats = () => {
    const securityStats = getSecurityStatistics();
    setStats(securityStats);
  };

  const handleExport = async (format: 'json' | 'csv') => {
    setIsExporting(true);
    try {
      const data = exportSecurityEvents(format);
      const blob = new Blob([data], { 
        type: format === 'json' ? 'application/json' : 'text/csv'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security-audit-log-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
    // Empty block
  } finally {
      setIsExporting(false);
    }
  };

  const getEventTypeIcon = (eventType: SecurityEventType) => {
    switch (eventType) {
      case SecurityEventType.LOGIN_SUCCESS:
      case SecurityEventType.LOGIN_FAILURE:
        return <UserCheck className="w-4 h-4" />;
      case SecurityEventType.LOGOUT:
        return <UserX className="w-4 h-4" />;
      case SecurityEventType.ACCOUNT_LOCKED:
        return <Lock className="w-4 h-4" />;
      case SecurityEventType.ACCOUNT_UNLOCKED:
        return <Unlock className="w-4 h-4" />;
      case SecurityEventType.SESSION_EXPIRED:
      case SecurityEventType.SESSION_REFRESH:
        return <Clock className="w-4 h-4" />;
      case SecurityEventType.CSRF_TOKEN_INVALID:
      case SecurityEventType.CSRF_TOKEN_EXPIRED:
        return <Key className="w-4 h-4" />;
      case SecurityEventType.SUSPICIOUS_ACTIVITY:
        return <AlertTriangle className="w-4 h-4" />;
      case SecurityEventType.ADMIN_ACTION:
        return <Shield className="w-4 h-4" />;
      case SecurityEventType.DATA_ACCESS:
      case SecurityEventType.DATA_MODIFICATION:
        return <FileText className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getEventTypeLabel = (eventType: SecurityEventType) => {
    return eventType.replace(/_/g, ' ').toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            Security Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor security events, track threats, and manage system security
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={loadSecurityStats}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button
            onClick={() => handleExport('json')}
            disabled={isExporting}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </Button>
          <Button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {(['24h', '7d', '30d'] as const).map((range) => (
          <Button
            key={range}
            variant={selectedTimeRange === range ? 'default' : 'outline'}
            onClick={() => setSelectedTimeRange(range)}
            size="sm"
          >
            {range === '24h' && 'Last 24 Hours'}
            {range === '7d' && 'Last 7 Days'}
            {range === '30d' && 'Last 30 Days'}
          </Button>
        ))}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              All security events recorded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedTimeRange === '24h' && stats.recentActivity.last24Hours}
              {selectedTimeRange === '7d' && stats.recentActivity.last7Days}
              {selectedTimeRange === '30d' && stats.recentActivity.last30Days}
            </div>
            <p className="text-xs text-muted-foreground">
              Events in selected period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Severity</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {(stats.eventsBySeverity.HIGH || 0) + (stats.eventsBySeverity.CRITICAL || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              High & Critical events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.eventsByType.LOGIN_SUCCESS || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Successful logins today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Events by Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Events by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.eventsByType).map(([eventType, count]) => (
                <div key={eventType} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getEventTypeIcon(eventType as SecurityEventType)}
                    <span className="text-sm font-medium">
                      {getEventTypeLabel(eventType as SecurityEventType)}
                    </span>
                  </div>
                  <Badge variant="secondary">{count as number}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Events by Severity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Events by Severity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.eventsBySeverity).map(([severity, count]) => (
                <div key={severity} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      severity === 'LOW' ? 'bg-green-500' :
                      severity === 'MEDIUM' ? 'bg-yellow-500' :
                      severity === 'HIGH' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`} />
                    <span className="text-sm font-medium">
                      {severity.charAt(0) + severity.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <Badge variant="secondary">{count as number}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Security Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.eventsBySeverity.HIGH || stats.eventsBySeverity.CRITICAL ? (
            <div className="space-y-3">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-semibold">High Severity Events Detected</span>
                </div>
                <p className="text-red-700 text-sm mt-2">
                  {stats.eventsBySeverity.HIGH || 0} high severity and {stats.eventsBySeverity.CRITICAL || 0} critical events require immediate attention.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">All Clear</span>
              </div>
              <p className="text-green-700 text-sm mt-2">
                No high or critical security events detected. System security status is good.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Quick Security Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <Lock className="w-6 h-6" />
              <span>Lock Account</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <Eye className="w-6 h-6" />
              <span>View Logs</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <Shield className="w-6 h-4" />
              <span>Security Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
