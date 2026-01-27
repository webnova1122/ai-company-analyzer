// Form step renderers for CompanyForm

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education',
  'Manufacturing', 'Real Estate', 'Food & Beverage', 'Transportation',
  'Entertainment', 'Energy', 'Agriculture', 'Retail', 'Consulting', 'Other'
];

const STAGES = [
  { value: 'idea', label: 'Idea Stage' },
  { value: 'startup', label: 'Startup (0-2 years)' },
  { value: 'growth', label: 'Growth Stage (2-5 years)' },
  { value: 'mature', label: 'Mature (5+ years)' },
  { value: 'enterprise', label: 'Enterprise' },
];

export const renderOperationsStep = (formData, updateField) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Business Model
      </label>
      <select
        name="businessModel"
        value={formData.businessModel}
        onChange={(e) => updateField('businessModel', e.target.value)}
        className="input-field"
      >
        <option value="">Select business model</option>
        <option value="b2b">B2B (Business to Business)</option>
        <option value="b2c">B2C (Business to Consumer)</option>
        <option value="b2b2c">B2B2C</option>
        <option value="marketplace">Marketplace</option>
        <option value="saas">SaaS (Software as a Service)</option>
        <option value="subscription">Subscription</option>
        <option value="ecommerce">E-commerce</option>
        <option value="freemium">Freemium</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Key Partners & Suppliers
      </label>
      <textarea
        name="keyPartners"
        value={formData.keyPartners}
        onChange={(e) => updateField('keyPartners', e.target.value)}
        className="input-field h-24 resize-none"
        placeholder="Who are your key partners, suppliers, or strategic alliances?"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Operations & Processes
      </label>
      <textarea
        name="operations"
        value={formData.operations}
        onChange={(e) => updateField('operations', e.target.value)}
        className="input-field h-24 resize-none"
        placeholder="Describe your key operational processes, supply chain, manufacturing, or service delivery..."
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Technology & Tools
      </label>
      <textarea
        name="technology"
        value={formData.technology}
        onChange={(e) => updateField('technology', e.target.value)}
        className="input-field h-20 resize-none"
        placeholder="What technology stack or tools do you use?"
      />
    </div>
  </div>
);

export const renderMarketingStep = (formData, updateField) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Customer Acquisition Strategy
      </label>
      <textarea
        name="customerAcquisition"
        value={formData.customerAcquisition}
        onChange={(e) => updateField('customerAcquisition', e.target.value)}
        className="input-field h-24 resize-none"
        placeholder="How do you acquire customers? What channels work best?"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Sales Channels
      </label>
      <textarea
        name="salesChannels"
        value={formData.salesChannels}
        onChange={(e) => updateField('salesChannels', e.target.value)}
        className="input-field h-20 resize-none"
        placeholder="Direct sales, online, retail, distributors, etc."
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Pricing Strategy
      </label>
      <textarea
        name="pricingStrategy"
        value={formData.pricingStrategy}
        onChange={(e) => updateField('pricingStrategy', e.target.value)}
        className="input-field h-20 resize-none"
        placeholder="Describe your pricing model and strategy..."
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Monthly Marketing Budget
      </label>
      <select
        name="marketingBudget"
        value={formData.marketingBudget}
        onChange={(e) => updateField('marketingBudget', e.target.value)}
        className="input-field"
      >
        <option value="">Select budget range</option>
        <option value="0">No marketing budget</option>
        <option value="1-1k">$1 - $1,000</option>
        <option value="1k-5k">$1,000 - $5,000</option>
        <option value="5k-10k">$5,000 - $10,000</option>
        <option value="10k-25k">$10,000 - $25,000</option>
        <option value="25k-50k">$25,000 - $50,000</option>
        <option value="50k+">$50,000+</option>
      </select>
    </div>
  </div>
);

export const renderEnhancedBasicsStep = (formData, updateField) => (
  <div className="space-y-6 animate-fade-in">
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
      <p className="text-sm text-blue-800">
        <strong>💡 Tip:</strong> Be specific! The more details you provide, the better your analysis will be.
      </p>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <span>Company Name</span>
        <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="companyName"
        value={formData.companyName}
        onChange={(e) => updateField('companyName', e.target.value)}
        className="input-field focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
        placeholder="e.g., TechStart Inc."
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Industry <span className="text-red-500">*</span>
        </label>
        <select
          name="industry"
          value={formData.industry}
          onChange={(e) => updateField('industry', e.target.value)}
          className="input-field"
        >
          <option value="">Select an industry</option>
          {INDUSTRIES.map(industry => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Stage <span className="text-red-500">*</span>
        </label>
        <select
          name="stage"
          value={formData.stage}
          onChange={(e) => updateField('stage', e.target.value)}
          className="input-field"
        >
          <option value="">Select stage</option>
          {STAGES.map(stage => (
            <option key={stage.value} value={stage.value}>{stage.label}</option>
          ))}
        </select>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Year Founded
      </label>
      <input
        type="number"
        name="foundedYear"
        value={formData.foundedYear}
        onChange={(e) => updateField('foundedYear', e.target.value)}
        className="input-field"
        placeholder="2020"
        min="1900"
        max={new Date().getFullYear()}
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Company Description
      </label>
      <textarea
        name="description"
        value={formData.description}
        onChange={(e) => updateField('description', e.target.value)}
        className="input-field h-24 resize-none"
        placeholder="Brief description of your company, mission, and vision..."
      />
    </div>
  </div>
);

export const renderEnhancedProductsStep = (formData, updateField) => (
  <div className="space-y-6 animate-fade-in">
    <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
      <p className="text-sm text-purple-800">
        <strong>🎯 This is important!</strong> Help us understand what makes your offering unique.
      </p>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <span>Products/Services</span>
        <span className="text-red-500">*</span>
      </label>
      <textarea
        name="products"
        value={formData.products}
        onChange={(e) => updateField('products', e.target.value)}
        className="input-field h-28 resize-none"
        placeholder="Describe your main products or services in detail..."
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Target Market <span className="text-red-500">*</span>
      </label>
      <textarea
        name="targetMarket"
        value={formData.targetMarket}
        onChange={(e) => updateField('targetMarket', e.target.value)}
        className="input-field h-24 resize-none"
        placeholder="Who are your ideal customers? Demographics, behaviors, needs, pain points..."
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Unique Value Proposition
      </label>
      <textarea
        name="uniqueValue"
        value={formData.uniqueValue}
        onChange={(e) => updateField('uniqueValue', e.target.value)}
        className="input-field h-20 resize-none"
        placeholder="What makes you different from competitors? Your unique advantage..."
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Main Competitors
      </label>
      <textarea
        name="competitors"
        value={formData.competitors}
        onChange={(e) => updateField('competitors', e.target.value)}
        className="input-field h-20 resize-none"
        placeholder="List main competitors and how you differentiate..."
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Market Trends & Opportunities
      </label>
      <textarea
        name="marketTrends"
        value={formData.marketTrends}
        onChange={(e) => updateField('marketTrends', e.target.value)}
        className="input-field h-20 resize-none"
        placeholder="Current market trends, opportunities, or shifts in your industry..."
      />
    </div>
  </div>
);

export const renderEnhancedFinancialsStep = (formData, updateField) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Revenue
        </label>
        <select
          name="revenue"
          value={formData.revenue}
          onChange={(e) => updateField('revenue', e.target.value)}
          className="input-field"
        >
          <option value="">Select revenue range</option>
          <option value="pre-revenue">Pre-revenue</option>
          <option value="0-100k">$0 - $100K</option>
          <option value="100k-500k">$100K - $500K</option>
          <option value="500k-1m">$500K - $1M</option>
          <option value="1m-5m">$1M - $5M</option>
          <option value="5m-10m">$5M - $10M</option>
          <option value="10m+">$10M+</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Monthly Burn Rate
        </label>
        <select
          name="burnRate"
          value={formData.burnRate}
          onChange={(e) => updateField('burnRate', e.target.value)}
          className="input-field"
        >
          <option value="">Select burn rate</option>
          <option value="profitable">Profitable / Cash positive</option>
          <option value="0-10k">$0 - $10K/month</option>
          <option value="10k-50k">$10K - $50K/month</option>
          <option value="50k-100k">$50K - $100K/month</option>
          <option value="100k-250k">$100K - $250K/month</option>
          <option value="250k+">$250K+/month</option>
        </select>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Funding Status
        </label>
        <select
          name="funding"
          value={formData.funding}
          onChange={(e) => updateField('funding', e.target.value)}
          className="input-field"
        >
          <option value="">Select funding status</option>
          <option value="bootstrapped">Bootstrapped</option>
          <option value="friends-family">Friends & Family</option>
          <option value="angel">Angel Investment</option>
          <option value="seed">Seed Round</option>
          <option value="series-a">Series A</option>
          <option value="series-b+">Series B+</option>
          <option value="profitable">Profitable/Self-funded</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Team Size
        </label>
        <select
          name="teamSize"
          value={formData.teamSize}
          onChange={(e) => updateField('teamSize', e.target.value)}
          className="input-field"
        >
          <option value="">Select team size</option>
          <option value="solo">Solo Founder</option>
          <option value="2-5">2-5 people</option>
          <option value="6-10">6-10 people</option>
          <option value="11-25">11-25 people</option>
          <option value="26-50">26-50 people</option>
          <option value="51-100">51-100 people</option>
          <option value="100+">100+ people</option>
        </select>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Key Team Roles & Expertise
      </label>
      <textarea
        name="keyRoles"
        value={formData.keyRoles}
        onChange={(e) => updateField('keyRoles', e.target.value)}
        className="input-field h-24 resize-none"
        placeholder="Describe key team members, their roles, and relevant expertise..."
      />
    </div>
  </div>
);

export const renderEnhancedGoalsStep = (formData, updateField) => (
  <div className="space-y-6 animate-fade-in">
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 rounded-r-lg">
      <p className="text-sm text-green-800">
        <strong>🎉 Final Step!</strong> You're almost done. Share your vision and we'll create your personalized roadmap.
      </p>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <span>Current Challenges</span>
      </label>
      <textarea
        name="challenges"
        value={formData.challenges}
        onChange={(e) => updateField('challenges', e.target.value)}
        className="input-field h-28 resize-none"
        placeholder="What are the main challenges your company is facing? (e.g., scaling, hiring, funding, product-market fit, competition...)"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Business Goals
      </label>
      <textarea
        name="goals"
        value={formData.goals}
        onChange={(e) => updateField('goals', e.target.value)}
        className="input-field h-28 resize-none"
        placeholder="What are your short-term and long-term business goals? (e.g., revenue targets, market expansion, product launches, exits...)"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Timeline for Goals
      </label>
      <select
        name="timeline"
        value={formData.timeline}
        onChange={(e) => updateField('timeline', e.target.value)}
        className="input-field"
      >
        <option value="">Select timeline</option>
        <option value="3-months">Next 3 months</option>
        <option value="6-months">Next 6 months</option>
        <option value="1-year">Next year</option>
        <option value="2-3-years">2-3 years</option>
        <option value="5-years">5+ years</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Key Success Metrics
      </label>
      <textarea
        name="successMetrics"
        value={formData.successMetrics}
        onChange={(e) => updateField('successMetrics', e.target.value)}
        className="input-field h-20 resize-none"
        placeholder="How do you measure success? What KPIs matter most? (e.g., MRR, user growth, retention, profitability...)"
      />
    </div>
  </div>
);

export { INDUSTRIES, STAGES };
