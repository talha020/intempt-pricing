document.addEventListener('DOMContentLoaded', (event) => {
  let addonMultiplier = 1;
  let addonFlatCost = 0;
  let playbooksCost = 0;
  let playbooksCostYearly = 0;
  let isPlaybookAdded = !1;
  const slider = document.getElementById('slider1');
  const rangeValue = document.getElementById('rangeValue');
  const ticks = document.querySelector('.ticks');
  const values = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 21000, 22000, 23000, 24000, 25000, 30000, 35000, 40000, 45000, 50000, 60000, 70000, 80000, 90000, 100000];
  let seatCount = 1;
  let seatValue = 1;
  let ftotal = 0;
  let totval = 0;
  let totalValueYearlymonthly = 0;
  const seatPricesMonthly = [59, 118, 177, 236, 295, 354, 413, 472, 531, 590, 649, 708, 767, 826, 885, 944, 1003, 1062, 1121, 1180.00];
  const seatPricesYearly = [588, 1176, 1764, 2352, 2940, 3528, 4116, 4704, 5292, 5880, 6468, 7056, 7644, 8232, 8820, 9408, 9996, 10584, 11172, 117600];
  calculateCost();
  slider.value = 1000;
  updateUI();
  const labeledValues = [1000, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000];

  function formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(0) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K'
    } else {
      return num
    }
  }
  values.forEach(value => {
    let position = (value - slider.min) / (slider.max - slider.min) * 100;
    let tick = document.createElement('div');
    tick.classList.add('tick');
    tick.style.left = `${position}%`;
    ticks.appendChild(tick);
    if (labeledValues.includes(value)) {
      let label = document.createElement('span');
      label.textContent = formatNumber(value);
      tick.appendChild(label)
    }
  });

  function updateAddons() {
    addonMultiplier = 1;
    addonFlatCost = 0
    const addonMultipliers = {
      journeys: 0.2,
      experiments: 0.2,
      insight: 0.5,
      predict: 0.2,
      playbookz: 0.2,
      premium: 0.2
    };
    for (const [addon, multiplier] of Object.entries(addonMultipliers)) {
      if (document.getElementById(`${addon}Remove`).style.display === 'inline') {
        addonMultiplier += multiplier
      }
    }
    if (document.getElementById('growthRemove').style.display === 'inline') {
      addonFlatCost = 5000
    }
    updateUI()
  }

  function updateUI() {
    const value = parseInt(slider.value);
    const newPosition = (value - slider.min) / (slider.max - slider.min) * 100;
    let MTU = value;
    let formattedMTU = formatNumber(MTU);
    if (rangeValue) {
      rangeValue.textContent = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      const sliderWidth = slider.offsetWidth;
      const tooltipWidth = rangeValue.offsetWidth;
      const newLeft = (newPosition / 100) * sliderWidth - tooltipWidth / 2;
      rangeValue.style.left = `${newLeft}px`
    }
    if (slider) {
      slider.style.setProperty('--percent', `${newPosition}%`)
    }
    const cost = calculateCost(value);
    if (cost !== null) {
      let dataIntelligenceCost = value * cost;
      let dataIntelligenceCostYearly = (dataIntelligenceCost * 12) * 0.85;
      const addonMultipliers = {
        journeys: 0.2,
        experiments: 0.2,
        insight: 0.5,
        predict: 0.2,
        playbookz: 0.2,
        premium: 0.2
      };
      let addonCosts = {};
      let addonYearlyCosts = {};
      for (const [addon, multiplier] of Object.entries(addonMultipliers)) {
        if (document.getElementById(`${addon}Remove`).style.display === 'inline') {
          addonCosts[addon] = dataIntelligenceCost * multiplier;
          addonYearlyCosts[addon] = (addonCosts[addon] * 12) * 0.85
        }
      }
      let growthCost = addonFlatCost;
      let growthCostYearly = (growthCost * 12) * 0.85;
      let totval = value * cost * addonMultiplier + addonFlatCost;
      let totval12 = ((value * cost * 12 * 0.85) + (addonFlatCost * 12)) * addonMultiplier;
      let mtotal12 = totval12;
      let ftotal = mtotal12;
      let totalValueYearlymonthly = ftotal / 12;
      totalValueYearlymonthly = totalValueYearlymonthly.toFixed(2);
      totval = totval.toFixed(2);
      ftotal = ftotal.toFixed(2);
      const updateTextContent = (selector, text) => {
        const el = document.querySelector(selector);
        if (el) {
          el.textContent = text
        }
      }
      updateTextContent("#DataIntelligenceMTU", formattedMTU);
      updateTextContent("#rangeValue1", "$" + totval.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
      updateTextContent("#rangeValue12", "$" + ftotal.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
      updateTextContent("#rangeValueYearlypermonh", "$" + totalValueYearlymonthly.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
      updateTextContent("#DataIntelligenceCost", "$" + dataIntelligenceCost.toFixed(2));
      updateTextContent("#JourneysCost", "$" + (addonCosts['journeys'] ? addonCosts['journeys'].toFixed(2) : "0.00"));
      updateTextContent("#InsightCost", "$" + (addonCosts['insight'] ? addonCosts['insight'].toFixed(2) : "0.00"));
    
      updateTextContent("#ExperimentsCost", "$" + (addonCosts['experiments'] ? addonCosts['experiments'].toFixed(2) : "0.00"));
      updateTextContent("#PredictCost", "$" + (addonCosts['predict'] ? addonCosts['predict'].toFixed(2) : "0.00"));
      updateTextContent("#PremiumCost", "$" + (addonCosts['premium'] ? addonCosts['premium'].toFixed(2) : "0.00"));
      updateTextContent("#GrowthCost", "$" + growthCost.toFixed(2));
      updateTextContent("#PlaybookszCost", "$" + (addonCosts['playbookz'] ? addonCosts['playbookz'].toFixed(2) : "0.00"));
      updateTextContent("#TotalCost", "$" + totval.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
      updateTextContent("#DataIntelligenceCostYearly", "$" + dataIntelligenceCostYearly.toFixed(2));
      updateTextContent("#JourneysCostYearly", "$" + (addonYearlyCosts['journeys'] ? addonYearlyCosts['journeys'].toFixed(2) : "0.00"));
      updateTextContent("#InsightCostYearly", "$" + (addonYearlyCosts['insight'] ? addonYearlyCosts['insight'].toFixed(2) : "0.00"));
      updateTextContent("#ExperimentsCostYearly", "$" + (addonYearlyCosts['experiments'] ? addonYearlyCosts['experiments'].toFixed(2) : "0.00"));
      updateTextContent("#PredictCostYearly", "$" + (addonYearlyCosts['predict'] ? addonYearlyCosts['predict'].toFixed(2) : "0.00"));
      updateTextContent("#PremiumCostYearly", "$" + (addonYearlyCosts['premium'] ? addonYearlyCosts['premium'].toFixed(2) : "0.00"));
    
      updateTextContent("#GrowthCostYearly", "$" + growthCostYearly.toFixed(2));
      updateTextContent("#PlaybookszCostYearly", "$" + (addonYearlyCosts['playbookz'] ? addonYearlyCosts['playbookz'].toFixed(2) : "0.00"));
      updateTextContent("#TotalCostYearly", "$" + ftotal.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"));
    }
  }

  function calculateCost(value) {
    let cost = 0;
    if (value === 1000) {
      cost = 0.0532
    } else if (value > 1000 && value <= 2000) {
      cost = 0.0521
    } else if (value > 2000 && value <= 3000) {
      cost = 0.0511
    } else if (value > 3000 && value <= 4000) {
      cost = 0.0501
    } else if (value > 4000 && value <= 5000) {
      cost = 0.0491
    } else if (value > 5000 && value <= 6000) {
      cost = 0.0481
    } else if (value > 6000 && value <= 7000) {
      cost = 0.0471
    } else if (value > 7000 && value <= 8000) {
      cost = 0.0462
    } else if (value > 8000 && value <= 9000) {
      cost = 0.0453
    } else if (value > 9000 && value <= 10000) {
      cost = 0.0444
    } else if (value > 10000 && value <= 11000) {
      cost = 0.0435
    } else if (value > 11000 && value <= 12000) {
      cost = 0.0426
    } else if (value > 12000 && value <= 13000) {
      cost = 0.0417
    } else if (value > 13000 && value <= 14000) {
      cost = 0.0409
    } else if (value > 14000 && value <= 15000) {
      cost = 0.0401
    } else if (value > 15000 && value <= 16000) {
      cost = 0.0393
    } else if (value > 16000 && value <= 17000) {
      cost = 0.0385
    } else if (value > 17000 && value <= 18000) {
      cost = 0.0377
    } else if (value > 18000 && value <= 19000) {
      cost = 0.0370
    } else if (value > 19000 && value <= 20000) {
      cost = 0.0362
    } else if (value > 20000 && value <= 21000) {
      cost = 0.0355
    } else if (value > 21000 && value <= 22000) {
      cost = 0.0348
    } else if (value > 22000 && value <= 23000) {
      cost = 0.0341
    } else if (value > 23000 && value <= 24000) {
      cost = 0.0334
    } else if (value > 24000 && value <= 25000) {
      cost = 0.0328
    } else if (value > 25000 && value <= 30000) {
      cost = 0.0321
    } else if (value > 30000 && value <= 35000) {
      cost = 0.0315
    } else if (value > 35000 && value <= 40000) {
      cost = 0.0308
    } else if (value > 40000 && value <= 45000) {
      cost = 0.0302
    } else if (value > 45000 && value <= 50000) {
      cost = 0.0296
    } else if (value > 50000 && value <= 60000) {
      cost = 0.0290
    } else if (value > 60000 && value <= 70000) {
      cost = 0.0284
    } else if (value > 70000 && value <= 80000) {
      cost = 0.0279
    } else if (value > 80000 && value <= 90000) {
      cost = 0.0273
    } else if (value > 90000 && value <= 100000) {
      cost = 0.0268
    }
    return cost
  } ['journeys', 'experiments', 'predict', 'insight', 'premium', 'playbookz', 'playbook'].forEach(addon => {
    document.getElementById(`${addon}Add`).addEventListener('click', function() {
      this.style.display = 'none';
      document.getElementById(`${addon}Remove`).style.display = 'inline';
      document.getElementById(`${addon}Div`).style.display = 'inline';
      if (addon === 'playbook') {
        isPlaybookAdded = !0
      }
      updateAddons()
      updateUI()
    });
    document.getElementById(`${addon}Remove`).addEventListener('click', function() {
      this.style.display = 'none';
      document.getElementById(`${addon}Div`).style.display = 'none';
      document.getElementById(`${addon}Add`).style.display = 'inline';
      if (addon === 'playbook') {
        isPlaybookAdded = !1;
        playbooksCost = 0;
        playbooksCostYearly = 0
      }
      updateAddons()
      updateUI()
    })
  });
  document.getElementById('growthAdd').addEventListener('click', function() {
    this.style.display = 'none';
    document.getElementById('growthRemove').style.display = 'inline';
    document.getElementById('growthDiv').style.display = 'inline';
    updateAddons()
  });
  document.getElementById('growthRemove').addEventListener('click', function() {
    this.style.display = 'none';
    document.getElementById('growthDiv').style.display = 'none';
    document.getElementById('growthAdd').style.display = 'inline';
    updateAddons()
  });

  function findClosestValue(array, num) {
    return array.reduce((prev, curr) => Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev)
  }
  slider.addEventListener('mouseup', () => {
    let closest = findClosestValue(values, slider.value);
    slider.value = closest;
    updateUI()
  });
  slider.addEventListener('input', () => {
    let closest = findClosestValue(values, slider.value);
    slider.value = closest;
    updateUI()
  });
  updateUI()
})
