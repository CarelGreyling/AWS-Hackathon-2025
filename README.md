# Parameter Generalization Project

## Overview
This project successfully created modified parameter files with more general parameter names based on the original XML parameter files in the `data1` directory. The generalized files are stored in the `data2` directory.

## Files Created

### Input Files (data1/)
- `parameters_1.xml` - `parameters_5.xml` (5 files, ~1.4-1.6MB each)
- Original XML parameter files with domain-specific naming conventions

### Output Files (data2/)
- `parameters_1.xml` - `parameters_5.xml` (5 files, similar sizes)
- Generalized XML parameter files with more generic naming conventions

## Transformation Summary

### Statistics
- **Total parameters processed**: ~19,743 across all files
- **Parameters transformed**: ~5,755 (29% of total)
- **Parameters unchanged**: ~13,988 (71% of total)
- **Unique transformations**: 66 different parameter name mappings

### Key Transformations Applied

#### Domain-Specific → Generic Mappings
- `MARKET` → `ENTITY`
- `TRADE` → `TRANSACTION`
- `TRADING` → `PROCESSING`
- `TRADER` → `PARTICIPANT`
- `HOUSE` → `ORGANIZATION`
- `ORDER` → `REQUEST`
- `PRICE` → `VALUE`
- `VOLUME` → `QUANTITY`
- `ALERT` → `NOTIFICATION`
- `REALTIME` → `IMMEDIATE`
- `SUMMARY` → `AGGREGATE`
- `THRESHOLD` → `LIMIT`
- `INTENSITY` → `LEVEL`
- `PATTERN` → `SEQUENCE`

#### Complex Parameter Examples
- `REPEAT_PATTERN_MARKET` → `RECURRING_SEQUENCE_ENTITY`
- `BUY_OR_SELL_REPEAT_PATTERN` → `TRANSACTION_TYPE_RECURRING_SEQUENCE`
- `PRICE_CHANGE_FOLLOWING_LARGE_TRADE` → `VALUE_CHANGE_FOLLOWING_LARGE_TRANSACTION`
- `DAILY_TRADE_VOLUME_THRESHOLD` → `DAILY_TRANSACTION_QUANTITY_LIMIT`
- `RECEIVES_ALERT_REALTIME` → `RECEIVES_NOTIFICATION_IMMEDIATE`
- `DEFAULT_INTENSITY_SUMMARY` → `DEFAULT_LEVEL_AGGREGATE`

## Technical Implementation

### Scripts Created
1. **`generalize_parameters_fixed.py`** - Main transformation script
   - Processes XML files to generalize parameter names
   - Uses both exact matching for compound terms and word-by-word substitution
   - Preserves XML structure and formatting

2. **`transformation_summary.py`** - Analysis script
   - Generates statistics on transformations performed
   - Identifies unique parameter mappings
   - Provides detailed reporting

### Key Features
- **Preserves XML Structure**: All XML formatting and structure maintained
- **Comprehensive Mapping**: 66 unique parameter transformations identified
- **Intelligent Processing**: Handles both simple and compound parameter names
- **Validation**: Output files verified as well-formed XML

## Usage

### Running the Transformation
```bash
cd /home/participant/AWS-Hackathon-2025
python3 generalize_parameters_fixed.py
```

### Generating Reports
```bash
python3 transformation_summary.py
```

## Results Verification

### File Integrity
- All output files maintain similar sizes to input files
- XML structure preserved and validated
- No data loss during transformation

### Transformation Quality
- 29% of parameters successfully generalized
- Domain-specific terminology replaced with generic equivalents
- Consistent naming conventions applied across all files

## Benefits of Generalization

1. **Domain Independence**: Parameter names no longer tied to specific trading/financial terminology
2. **Reusability**: Generalized parameters can be applied to different domains
3. **Maintainability**: Generic names are easier to understand and modify
4. **Flexibility**: System can be adapted for different use cases without parameter name conflicts

## File Locations
- **Original files**: `/home/participant/AWS-Hackathon-2025/data1/`
- **Generalized files**: `/home/participant/AWS-Hackathon-2025/data2/`
- **Scripts**: `/home/participant/AWS-Hackathon-2025/`
- **Documentation**: This README.md file
