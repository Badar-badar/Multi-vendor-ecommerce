import {
  generateSalesReport,
  generateOrdersReport,
  generateSellerReport,
  generatePaymentsReport,
} from '../services/reportService.js';
import { addReportJob } from '../queues/reportQueue.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * Handles JSON or CSV report responses appropriately
 */
const handleReportResponse = (res, reportResult, defaultTitle) => {
  if (reportResult.contentType === 'text/csv') {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${reportResult.filename}"`);
    return res.status(200).send(reportResult.data);
  }

  return sendSuccess(res, {
    statusCode: 200,
    message: `${defaultTitle} generated successfully.`,
    data: reportResult,
  });
};

export const getSalesReport = async (req, res) => {
  const result = await generateSalesReport(req.query);
  return handleReportResponse(res, result, 'Sales Report');
};

export const getOrdersReport = async (req, res) => {
  const result = await generateOrdersReport(req.query);
  return handleReportResponse(res, result, 'Orders Report');
};

export const getSellerReport = async (req, res) => {
  const result = await generateSellerReport(req.query);
  return handleReportResponse(res, result, 'Seller Report');
};

export const getPaymentsReport = async (req, res) => {
  const result = await generatePaymentsReport(req.query);
  return handleReportResponse(res, result, 'Payments Report');
};

export const queueBackgroundReport = async (req, res) => {
  const { reportType, ...query } = req.body || {};
  const supportedReportTypes = ['sales', 'orders', 'sellers', 'payments'];

  if (!supportedReportTypes.includes(reportType)) {
    return res.status(400).json({
      success: false,
      message: `Unsupported report type. Supported types: ${supportedReportTypes.join(', ')}.`,
    });
  }

  const job = await addReportJob('generate-report', {
    reportType,
    query: { ...query, format: 'json' },
    userId: req.user._id.toString(),
  });

  if (!job) {
    return res.status(503).json({
      success: false,
      message: 'Background report service is unavailable. Please try again later.',
    });
  }

  return sendSuccess(res, {
    statusCode: 202,
    message: 'Report generation started. You will receive a notification when it is ready.',
    data: {
      jobId: job.id,
      reportType,
    },
  });
};

export default {
  getSalesReport,
  getOrdersReport,
  getSellerReport,
  getPaymentsReport,
  queueBackgroundReport,
};
