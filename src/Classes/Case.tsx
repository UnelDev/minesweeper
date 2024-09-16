class Case {
	private status: caseStatus;
	private isBombed: boolean;
	proximity: number;
	constructor(isBombed: boolean) {
		this.isBombed = isBombed;
		this.status = 'hidden';
		this.proximity = 0;
	}

	getStatus() {
		return this.status;
	}

	getBombed() {
		return this.isBombed;
	}

	click(type: string) {
		if (type === 'contextmenu') {
			this.flag();
		} else if (type === 'click') {
			this.mine();
		}
	}

	private mine() {
		if (this.isBombed) {
			return false;
		} else {
			this.status = 'visible';
			return true;
		}
	}

	private flag() {
		this.status = 'flagged';
		return false;
	}

	show(key: number) {
		switch (this.status) {
			case 'visible':
				return this.showVisible(key);
			case 'hidden':
				return this.showHidden(key);
			case 'flagged':
				return this.showFlagged(key);
			default:
				return <div></div>;
		}
	}

	private showVisible(key: number) {
		return (
			<div key={key} className="case caseVisible">
				{this.proximity}
			</div>
		);
	}

	private showHidden(key: number) {
		return (
			<div
				key={key}
				onContextMenu={this.flag.bind(this)}
				onClick={this.mine.bind(this)}
				className="case caseHidden"
			></div>
		);
	}

	private showFlagged(key: number) {
		return (
			<div key={key} className="case caseFlagged">
				F
			</div>
		);
	}
}

export default Case;
