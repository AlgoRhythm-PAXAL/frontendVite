# Enhanced NumberShowingCard Usage Examples

## Basic Usage with Historical Comparison

```jsx
import NumberShowingCard from './NUmberShowingCard';
import { faUsers, faTruck, faUserShield } from '@fortawesome/free-solid-svg-icons';

// Example 1: 7-day comparison (default)
<NumberShowingCard
  title="Total Customers"
  type="Customer"
  icon={faUsers}
  lightColor="bg-blue-50"
  textColor="text-blue-600"
  description="Active customer accounts"
  comparisonPeriod={7}
  enableAutoRefresh={true}
/>

// Example 2: 30-day comparison
<NumberShowingCard
  title="Active Drivers"
  type="Driver"
  icon={faTruck}
  lightColor="bg-green-50"
  textColor="text-green-600"
  description="Drivers on duty"
  comparisonPeriod={30}
  enableAutoRefresh={true}
  refreshInterval={60000} // 1 minute
/>

// Example 3: Yesterday comparison
<NumberShowingCard
  title="System Admins"
  type="Admin"
  icon={faUserShield}
  lightColor="bg-purple-50"
  textColor="text-purple-600"
  description="Administrative users"
  comparisonPeriod={1}
  onDataUpdate={(data) => console.log('Admin count updated:', data)}
  onError={(error) => console.error('Failed to load admin count:', error)}
/>
```

## Data Structure Returned

The component now returns enhanced data in the `onDataUpdate` callback:

```javascript
{
  count: 150,              // Current count
  previousCount: 142,      // Count from comparison period
  change: 8,               // Difference (current - previous)
  changePercentage: 5.6,   // Percentage change
  type: "Customer",        // Type of data
  comparisonPeriod: 7,     // Days compared
  timestamp: 1673884800000 // When data was fetched
}
```

## Visual Indicators

The component now shows:
- **Current count**: Large number display
- **Change indicator**: Shows increase/decrease with icon
- **Period reference**: "vs 7 days ago", "vs yesterday", etc.
- **Percentage change**: Color-coded percentage with trend arrow
- **Live status**: Green dot when auto-refresh is enabled

## Comparison Periods

- `1` = Yesterday
- `7` = 7 days ago (default)
- `30` = 30 days ago
- `90` = 3 months ago
- Custom number = X days ago

## Backend Requirements

The component expects the backend endpoint to accept a `date` parameter:

```
GET /api/admin/users/count?user=Customer&date=2025-01-14
```

This should return historical count data for the specified date.
