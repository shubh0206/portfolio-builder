// Enhanced GET endpoint
router.get('/', auth, async (req, res, next) => {
    try {
      const portfolio = await Portfolio.findOne({ user: req.user.id })
        .populate('user', 'email createdAt') // Populate user details
        .lean(); // Convert to plain JavaScript object
      
      if (!portfolio) {
        // Create a new portfolio if none exists
        const newPortfolio = await Portfolio.create({ 
          user: req.user.id,
          personalInfo: { email: req.user.email } // Set default email
        });
        return res.status(201).json(newPortfolio);
      }
  
      // Transform data before sending
      const response = {
        ...portfolio,
        stats: {
          experienceCount: portfolio.experience?.length || 0,
          skillCount: portfolio.skills?.length || 0
        }
      };
  
      res.json(response);
    } catch (err) {
      next(err); // Pass to error handler
    }
  });
  
  // Enhanced PUT endpoint
  router.put('/', auth, async (req, res, next) => {
    try {
      // Validate required fields
      if (!req.body.personalInfo?.fullName) {
        return res.status(400).json({ error: 'Full name is required' });
      }
  
      // Transform incoming data
      const updateData = {
        personalInfo: {
          ...req.body.personalInfo,
          email: req.body.personalInfo.email || req.user.email // Ensure email matches user
        },
        contactDetails: req.body.contactDetails || {},
        skills: [...new Set(req.body.skills)] // Remove duplicates
      };
  
      const options = {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      };
  
      const portfolio = await Portfolio.findOneAndUpdate(
        { user: req.user.id },
        { $set: updateData },
        options
      );
  
      if (!portfolio) {
        throw new Error('Failed to update portfolio');
      }
  
      res.json({
        success: true,
        lastUpdated: portfolio.updatedAt,
        stats: {
          skills: portfolio.skills.length,
          experience: portfolio.experience.length
        }
      });
    } catch (err) {
      next(err);
    }
  });
  
  // Add error handling middleware at the end
  router.use((err, req, res, next) => {
    console.error('Portfolio route error:', err);
    
    if (err.name === 'ValidationError') {
      return res.status(422).json({
        error: 'Validation failed',
        details: Object.values(err.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({ 
      error: 'Server error',
      message: err.message 
    });
  });