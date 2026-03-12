const Member = require('../../Member/models/Member');
const Order = require('../../Member/models/order');

// @desc    Get all members for admin
// @route   GET /api/admin/members
// @access  Private (Admin only)
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    // Calculate stats for each member from orders
    const membersWithStats = await Promise.all(
      members.map(async (member) => {
        const orders = await Order.find({ userId: member._id.toString() });
        const paidOrders = orders.filter(order => order.paymentStatus === 'paid');
        const totalSpent = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);

        return {
          _id: member._id,
          name: member.name || 'N/A',
          email: member.email,
          phone: member.phone,
          status: member.status || 'active',
          role: 'Customer',
          orders: orders.length,
          totalSpent: totalSpent,
          joinDate: member.createdAt,
          lastActive: member.updatedAt,
          createdAt: member.createdAt,
          updatedAt: member.updatedAt
        };
      })
    );

    res.status(200).json({
      success: true,
      count: membersWithStats.length,
      data: membersWithStats
    });

  } catch (error) {
    console.error('❌ Get members error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single member by ID
// @route   GET /api/admin/members/:id
// @access  Private (Admin only)
exports.getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).select('-password');

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    const memberData = {
      _id: member._id,
      name: member.name || 'N/A',
      email: member.email,
      phone: member.phone,
      status: member.status || 'active',
      role: 'Customer',
      orders: 0, // TODO: Calculate from orders
      totalSpent: 0, // TODO: Calculate from orders
      joinDate: member.createdAt,
      lastActive: member.updatedAt,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt
    };

    res.status(200).json({
      success: true,
      data: memberData
    });

  } catch (error) {
    console.error('❌ Get member error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update member status
// @route   PUT /api/admin/members/:id/status
// @access  Private (Admin only)
exports.updateMemberStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be active or inactive'
      });
    }

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select('-password');

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Member status updated successfully',
      data: member
    });

  } catch (error) {
    console.error('❌ Update member status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete member
// @route   DELETE /api/admin/members/:id
// @access  Private (Admin only)
exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Member deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete member error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
