const driverService = require('../services/driver.service');

const getAvailableJobs = async (req, res) => {
  try {
    const jobs = await driverService.getAvailableJobs();

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error('Error fetching available jobs:', error);
    res.status(error.status || 500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const jobs = await driverService.getMyJobs(req.user.id);

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error('Error fetching my jobs:', error);
    res.status(error.status || 500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

const getJobDetail = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await driverService.getJobDetail(req.user.id, jobId);

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error('Error fetching job detail:', error);
    res.status(error.status || 500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

const takeJob = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await driverService.takeJob(req.user.id, orderId);

    res.status(200).json({
      success: true,
      message: 'Job taken successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error taking job:', error);
    res.status(error.status || 400).json({ success: false, message: error.message || 'Internal server error' });
  }
};

const completeJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const result = await driverService.completeJob(req.user.id, jobId);

    res.status(200).json({
      success: true,
      message: 'Job completed successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error completing job:', error);
    res.status(error.status || 400).json({ success: false, message: error.message || 'Internal server error' });
  }
};

const getMyEarnings = async (req, res) => {
  try {
    const earnings = await driverService.getMyEarnings(req.user.id);

    res.status(200).json({
      success: true,
      data: earnings,
    });
  } catch (error) {
    console.error('Error fetching earnings:', error);
    res.status(error.status || 500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

module.exports = {
  getAvailableJobs,
  getMyJobs,
  getJobDetail,
  takeJob,
  completeJob,
  getMyEarnings,
};
