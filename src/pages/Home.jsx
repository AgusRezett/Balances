// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";

// Components
import AreaGraph from "../components/graphs/AreaGraph";
import PhysicalMoneyContainer from "../components/pages/home/PhysicalMoneyContainer";
import InvestedMoneyContainer from "../components/pages/home/InvestedMoneyContainer";
import TableInformation from "../components/pages/home/TableInformation";

// Data
import currentMoney from "../data/currentMoney.json";

const getTotalPhysical = (money) => {
	return money.physical.underC + money.physical.overC + money.physical.uala;
};

const getTotalInvested = (money, usdPrice) => {
	let total;
	if (usdPrice !== 0) {
		total = Math.round((money.invested.binance + money.invested.mdex) * usdPrice);
	} else {
		total = money.invested.binance + money.invested.mdex;
	}
	return total;
};

const getInvestedAvailable = (money, usdPrice) => {
	let total;
	if (usdPrice !== 0) {
		total = Math.round((money.invested.binance + money.profit.binance) * usdPrice);
	} else {
		total = money.invested.binance + money.profit.binance;
	}
	return total;
};

export default function Home({ usdValues, usdPrice }) {
	const [totalInvested, setTotalInvested] = useState(false);
	const [textTotal, setTextTotal] = useState(" ! invertido");

	const [investedProfit, setInvestedProfit] = useState(false);
	const [textInvested, setTextInvested] = useState(" ! ganancias");

	const [viewWidth, setViewWidth] = useState(0);

	const [money, setMoney] = useState(currentMoney);

	useEffect(() => {
		const roundUsdValue = (value) => {
			return (value / usdPrice).toFixed(2);
		};
		if (usdValues) {
			let moneyUsd = {
				physical: {
					underC: roundUsdValue(currentMoney.physical.underC),
					overC: roundUsdValue(currentMoney.physical.overC),
					uala: roundUsdValue(currentMoney.physical.uala),
				},
				invested: {
					binance: roundUsdValue(currentMoney.invested.binance),
					mdex: roundUsdValue(currentMoney.invested.mdex),
				},
				profit: {
					binance: roundUsdValue(currentMoney.profit.binance),
					mdex: roundUsdValue(currentMoney.profit.mdex),
				},
			};
			setMoney(moneyUsd);
		} else {
			setMoney(currentMoney);
		}

		//? Toggle profit value for showing or not
		const profitBtn = document.getElementById("profit-btn");
		if (investedProfit) {
			setTextInvested(" + ganancias");
			profitBtn.classList.add("profit-btn-active");
		} else {
			setTextInvested(" ! ganancias");
			profitBtn.classList.remove("profit-btn-active");
		}

		//? Toggle total money value for showing invested money or not
		const totalBtn = document.getElementById("total-btn");
		if (totalInvested) {
			setTextTotal(" + invertido");
			totalBtn.classList.add("total-btn-active");
		} else {
			setTextTotal(" ! invertido");
			totalBtn.classList.remove("total-btn-active");
		}

		//? Set the section view width
		const pageView = document.getElementById("page-view");
		const changeDisplay = () => {
			setViewWidth(pageView.offsetWidth);
		};
		changeDisplay();
		window.addEventListener("resize", changeDisplay);

		return () => {
			window.removeEventListener("resize", changeDisplay);
		};
	}, [investedProfit, totalInvested, usdPrice, usdValues]);

	return (
		<main id="page-view">
			<div className="row general-graph-container">
				<div className="principal-sections-container col-md-6">
					<div className="principal-sections-content section-graph">
						<AreaGraph usdValues={usdValues} usdPrice={usdPrice} />
					</div>
				</div>
				<div className="principal-sections-container col-sm-12 col-md-6 ">
					<div className="principal-sections-content principal-sections-column">
						<div className="secondary-sections-container col-sm-12">
							<div className="secondary-sections-content">
								<h6>
									Dinero Total Físico
									<span
										onClick={() => {
											setTotalInvested(!totalInvested);
										}}
										className="total-btn"
										id="total-btn"
									>
										{textTotal}
									</span>
								</h6>
								<PhysicalMoneyContainer
									totalInvested={totalInvested}
									getTotalPhysical={getTotalPhysical(currentMoney)}
									getTotalInvested={getTotalInvested(currentMoney, usdPrice)}
									getInvestedAvailable={getInvestedAvailable(currentMoney, 0)}
									usdPrice={usdPrice}
									viewWidth={viewWidth}
								/>
							</div>
						</div>
						<div className="secondary-sections-container col-sm-12">
							<div className="secondary-sections-content">
								<h6>
									Dinero Total Invertido
									<span
										onClick={() => {
											setInvestedProfit(!investedProfit);
										}}
										className="profit-btn"
										id="profit-btn"
									>
										{textInvested}
									</span>
								</h6>
								<InvestedMoneyContainer
									investedProfit={investedProfit}
									money={money}
									viewWidth={viewWidth}
									usdValues={usdValues}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="row general-graph-container">
				<div className="principal-sections-container col-12" style={{ height: "100% " }}>
					<div className="principal-sections-content section-graph">
						<TableInformation usdValues={usdValues} usdPrice={usdPrice} />
					</div>
				</div>
			</div>
		</main>
	);
}
