/**
 * Address Validation and Security Service
 * Validates Indian addresses, PIN codes, and detects suspicious patterns
 */

// Indian state-wise PIN code ranges
const PINCODE_RANGES = {
  'Andhra Pradesh': { ranges: [[500000, 535594]], code: 'AP' },
  'Arunachal Pradesh': { ranges: [[790001, 792131]], code: 'AR' },
  'Assam': { ranges: [[781001, 788931]], code: 'AS' },
  'Bihar': { ranges: [[800001, 855117]], code: 'BR' },
  'Chhattisgarh': { ranges: [[490001, 497778]], code: 'CG' },
  'Goa': { ranges: [[403001, 403806]], code: 'GA' },
  'Gujarat': { ranges: [[360001, 396590]], code: 'GJ' },
  'Haryana': { ranges: [[121001, 136156]], code: 'HR' },
  'Himachal Pradesh': { ranges: [[171001, 177601]], code: 'HP' },
  'Jharkhand': { ranges: [[813001, 835325]], code: 'JH' },
  'Karnataka': { ranges: [[560001, 591346]], code: 'KA' },
  'Kerala': { ranges: [[670001, 695615]], code: 'KL' },
  'Madhya Pradesh': { ranges: [[450001, 488448]], code: 'MP' },
  'Maharashtra': { ranges: [[400001, 445402]], code: 'MH' },
  'Manipur': { ranges: [[795001, 795159]], code: 'MN' },
  'Meghalaya': { ranges: [[793001, 794115]], code: 'ML' },
  'Mizoram': { ranges: [[796001, 796901]], code: 'MZ' },
  'Nagaland': { ranges: [[797001, 798627]], code: 'NL' },
  'Odisha': { ranges: [[751001, 770076]], code: 'OR' },
  'Punjab': { ranges: [[140001, 160104]], code: 'PB' },
  'Rajasthan': { ranges: [[301001, 345034]], code: 'RJ' },
  'Sikkim': { ranges: [[737101, 737139]], code: 'SK' },
  'Tamil Nadu': { ranges: [[600001, 643253]], code: 'TN' },
  'Telangana': { ranges: [[500001, 509412]], code: 'TG' },
  'Tripura': { ranges: [[799001, 799290]], code: 'TR' },
  'Uttar Pradesh': { ranges: [[201001, 285223]], code: 'UP' },
  'Uttarakhand': { ranges: [[244001, 263680]], code: 'UK' },
  'West Bengal': { ranges: [[700001, 743711]], code: 'WB' },
  'Andaman and Nicobar': { ranges: [[744101, 744304]], code: 'AN' },
  'Chandigarh': { ranges: [[160001, 160103]], code: 'CH' },
  'Dadra and Nagar Haveli': { ranges: [[396001, 396240]], code: 'DN' },
  'Daman and Diu': { ranges: [[396001, 396240]], code: 'DD' },
  'Delhi': { ranges: [[110001, 110097]], code: 'DL' },
  'Jammu and Kashmir': { ranges: [[180001, 194404]], code: 'JK' },
  'Ladakh': { ranges: [[194101, 194404]], code: 'LA' },
  'Lakshadweep': { ranges: [[682551, 682559]], code: 'LD' },
  'Puducherry': { ranges: [[605001, 673310]], code: 'PY' },
};

// Major city PIN codes for quick validation
const CITY_PINCODES = {
  'Mumbai': { ranges: [[400001, 400104]], state: 'Maharashtra' },
  'Delhi': { ranges: [[110001, 110097]], state: 'Delhi' },
  'Bangalore': { ranges: [[560001, 560110]], state: 'Karnataka' },
  'Bengaluru': { ranges: [[560001, 560110]], state: 'Karnataka' },
  'Hyderabad': { ranges: [[500001, 500104]], state: 'Telangana' },
  'Chennai': { ranges: [[600001, 600132]], state: 'Tamil Nadu' },
  'Kolkata': { ranges: [[700001, 700159]], state: 'West Bengal' },
  'Pune': { ranges: [[411001, 412412]], state: 'Maharashtra' },
  'Ahmedabad': { ranges: [[380001, 382490]], state: 'Gujarat' },
  'Jaipur': { ranges: [[302001, 303905]], state: 'Rajasthan' },
  'Lucknow': { ranges: [[226001, 227308]], state: 'Uttar Pradesh' },
  'Kanpur': { ranges: [[208001, 209861]], state: 'Uttar Pradesh' },
  'Nagpur': { ranges: [[440001, 441501]], state: 'Maharashtra' },
  'Indore': { ranges: [[452001, 453771]], state: 'Madhya Pradesh' },
  'Thane': { ranges: [[400601, 421605]], state: 'Maharashtra' },
  'Bhopal': { ranges: [[462001, 462051]], state: 'Madhya Pradesh' },
  'Visakhapatnam': { ranges: [[530001, 531163]], state: 'Andhra Pradesh' },
  'Pimpri-Chinchwad': { ranges: [[411017, 411062]], state: 'Maharashtra' },
  'Patna': { ranges: [[800001, 804453]], state: 'Bihar' },
  'Vadodara': { ranges: [[390001, 391780]], state: 'Gujarat' },
};

export const addressValidation = {
  /**
   * Validate PIN code format (6 digits)
   */
  isValidPinFormat(pincode) {
    const pinRegex = /^[1-9][0-9]{5}$/;
    return pinRegex.test(pincode);
  },

  /**
   * Validate phone number format (10 digits, starts with 6-9)
   */
  isValidPhoneFormat(phone) {
    const phoneRegex = /^[6-9][0-9]{9}$/;
    return phoneRegex.test(phone);
  },

  /**
   * Validate if PIN code belongs to the given state
   */
  validatePinForState(pincode, state) {
    if (!this.isValidPinFormat(pincode)) {
      return { valid: false, error: 'Invalid PIN code format' };
    }

    const pin = parseInt(pincode, 10);
    const stateData = PINCODE_RANGES[state];

    if (!stateData) {
      return { valid: false, error: 'Invalid state name' };
    }

    const inRange = stateData.ranges.some(
      ([min, max]) => pin >= min && pin <= max
    );

    if (!inRange) {
      return {
        valid: false,
        error: `PIN code ${pincode} does not belong to ${state}`,
        suggestion: `Please verify your PIN code. ${state} PIN codes typically start with ${Math.floor(stateData.ranges[0][0] / 100000)}`,
      };
    }

    return { valid: true };
  },

  /**
   * Validate if PIN code belongs to the given city
   */
  validatePinForCity(pincode, city, state) {
    if (!this.isValidPinFormat(pincode)) {
      return { valid: false, error: 'Invalid PIN code format' };
    }

    const pin = parseInt(pincode, 10);
    const normalizedCity = city.trim();
    const cityData = CITY_PINCODES[normalizedCity];

    // If city is not in our database, just validate against state
    if (!cityData) {
      return this.validatePinForState(pincode, state);
    }

    // Check if state matches
    if (cityData.state !== state) {
      return {
        valid: false,
        error: `${normalizedCity} is in ${cityData.state}, not ${state}`,
      };
    }

    // Check if PIN is in city range
    const inRange = cityData.ranges.some(
      ([min, max]) => pin >= min && pin <= max
    );

    if (!inRange) {
      return {
        valid: false,
        error: `PIN code ${pincode} does not belong to ${normalizedCity}`,
        suggestion: `${normalizedCity} PIN codes are typically in the range ${cityData.ranges[0][0]}-${cityData.ranges[0][1]}`,
      };
    }

    return { valid: true };
  },

  /**
   * Get state from PIN code
   */
  getStateFromPin(pincode) {
    if (!this.isValidPinFormat(pincode)) {
      return null;
    }

    const pin = parseInt(pincode, 10);

    for (const [state, data] of Object.entries(PINCODE_RANGES)) {
      const inRange = data.ranges.some(
        ([min, max]) => pin >= min && pin <= max
      );
      if (inRange) {
        return state;
      }
    }

    return null;
  },

  /**
   * Detect suspicious address patterns
   */
  detectSuspiciousPatterns(address) {
    const suspiciousPatterns = [
      /test/i,
      /dummy/i,
      /fake/i,
      /asdf/i,
      /qwerty/i,
      /123456/,
      /abcdef/i,
      /xxxxxx/i,
      /\b(\w+)\s+\1\s+\1/i, // Repeated words
      /^(.)\1{9,}/, // Same character repeated 10+ times
    ];

    const flags = [];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(address.address)) {
        flags.push({
          type: 'suspicious_pattern',
          message: 'Address contains suspicious pattern',
          severity: 'high',
        });
        break;
      }
    }

    // Check if address is too short
    if (address.address.trim().length < 10) {
      flags.push({
        type: 'too_short',
        message: 'Address is too short',
        severity: 'medium',
      });
    }

    // Check if phone number is sequential
    const phone = address.phone.replace(/\D/g, '');
    if (/^0123456789$|^9876543210$/.test(phone)) {
      flags.push({
        type: 'sequential_phone',
        message: 'Phone number appears to be sequential',
        severity: 'high',
      });
    }

    // Check if phone has all same digits
    if (/^(\d)\1{9}$/.test(phone)) {
      flags.push({
        type: 'repeated_phone',
        message: 'Phone number has all same digits',
        severity: 'high',
      });
    }

    // Check name validity
    if (address.fullName && address.fullName.length < 3) {
      flags.push({
        type: 'invalid_name',
        message: 'Name is too short',
        severity: 'medium',
      });
    }

    return {
      suspicious: flags.length > 0,
      flags,
      riskScore: flags.reduce((score, flag) => {
        return score + (flag.severity === 'high' ? 10 : 5);
      }, 0),
    };
  },

  /**
   * Comprehensive address validation
   */
  validateAddress(address) {
    const errors = [];
    const warnings = [];

    // 1. Format validation
    if (!this.isValidPinFormat(address.pincode)) {
      errors.push({
        field: 'pincode',
        message: 'Invalid PIN code format. Must be 6 digits.',
      });
    }

    if (!this.isValidPhoneFormat(address.phone)) {
      errors.push({
        field: 'phone',
        message: 'Invalid phone number. Must be 10 digits starting with 6-9.',
      });
    }

    // 2. PIN code validation
    if (this.isValidPinFormat(address.pincode)) {
      const pinValidation = this.validatePinForCity(
        address.pincode,
        address.city,
        address.state
      );

      if (!pinValidation.valid) {
        errors.push({
          field: 'pincode',
          message: pinValidation.error,
          suggestion: pinValidation.suggestion,
        });
      }
    }

    // 3. Fraud detection
    const fraudCheck = this.detectSuspiciousPatterns(address);
    if (fraudCheck.suspicious) {
      fraudCheck.flags.forEach((flag) => {
        if (flag.severity === 'high') {
          errors.push({
            field: 'security',
            message: flag.message,
            type: flag.type,
          });
        } else {
          warnings.push({
            field: 'security',
            message: flag.message,
            type: flag.type,
          });
        }
      });
    }

    // 4. Required fields
    const requiredFields = ['fullName', 'phone', 'address', 'city', 'state', 'pincode'];
    requiredFields.forEach((field) => {
      if (!address[field] || address[field].toString().trim().length === 0) {
        errors.push({
          field,
          message: `${field} is required`,
        });
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      riskScore: fraudCheck.riskScore,
      autoApprove: errors.length === 0 && fraudCheck.riskScore < 10,
    };
  },

  /**
   * Format error messages for display
   */
  formatErrors(validation) {
    if (validation.valid) return null;

    const messages = validation.errors.map((err) => {
      let msg = err.message;
      if (err.suggestion) {
        msg += `\n💡 ${err.suggestion}`;
      }
      return msg;
    });

    return messages.join('\n\n');
  },

  /**
   * Get suggestions for user
   */
  getSuggestions(pincode) {
    const state = this.getStateFromPin(pincode);
    if (state) {
      return {
        state,
        message: `This PIN code belongs to ${state}`,
      };
    }
    return null;
  },
};

export default addressValidation;
