// Enhanced Experience Schema
const ExperienceSchema = new mongoose.Schema({
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      match: [/^[a-zA-Z0-9\s-]+$/, 'Invalid duration format']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [20, 'Description should be at least 20 characters']
    }
  }, { _id: true }); // Ensure each experience gets its own ID
  
  // Enhanced Portfolio Schema
  const PortfolioSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true // Add index for better performance
    },
    personalInfo: {
      fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        match: [emailRegex, 'Please enter a valid email']
      },
      phone: {
        type: String,
        validate: {
          validator: function(v) {
            return /^[\d\s+-]+$/.test(v);
          },
          message: props => `${props.value} is not a valid phone number!`
        }
      },
      photoUrl: {
        type: String,
        validate: {
          validator: function(v) {
            return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
          },
          message: props => `${props.value} is not a valid URL!`
        }
      }
    },
    // Add similar enhancements to all other sections
    skills: {
      type: [String],
      validate: {
        validator: function(v) {
          return v.length <= 50; // Maximum 50 skills
        },
        message: 'Cannot have more than 50 skills'
      }
    }
  }, {
    timestamps: true, // Adds createdAt and updatedAt automatically
    toJSON: { virtuals: true }, // Include virtuals when converting to JSON
    toObject: { virtuals: true }
  });
  
  // Add text index for search functionality
  PortfolioSchema.index({
    'personalInfo.fullName': 'text',
    'personalInfo.email': 'text',
    'skills': 'text'
  });
  
  // Add pre-save hook for validation
  PortfolioSchema.pre('save', function(next) {
    console.log('Saving portfolio for user:', this.user);
    next();
  });
  
  module.exports = mongoose.model('Portfolio', PortfolioSchema);