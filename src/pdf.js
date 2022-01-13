/**
 * PDF Proxy + helper
 * 
 * use pdf-lib
 */

class PDF {

	/*
	 * 
	 * name: inconnu
	 * @param
	 * @return
	 * TODO add more options : fonts...
	 */

	static addFooter = async function (doc, sLeft, options = {}) {
		const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib; 
		const pageCnt = doc.getPageCount();
		const pagesCntTpl = "8".repeat(pageCnt);
		const timesRomanFont = await doc.embedFont(StandardFonts.TimesRoman);
		const iFontSize = 12;
		const iTextRigthSz = timesRomanFont.widthOfTextAtSize(`page ${pagesCntTpl} / ${pagesCntTpl}`, iFontSize);
		const iMarginLeft = 10;
		const iMarginRight = 10;
		const iBorderWidth = 1;
		const oBorderColor = rgb(0 / 255, 0 / 255, 0 / 255);
		const oBackgroundColor = rgb(253 / 255, 246 / 255, 227 / 255);
		const iPaddingLeft = 5;
		const iPaddingRigth = 5;
		const iPaddingTop = 3;
		const iPaddingBottom = 3;
		const bNotOnFirstPage = true;
		doc.getPages().forEach((page, idx) => {
			if (bNotOnFirstPage === true && idx == 0) {
			}
			else {
				const { width, height } = page.getSize();
				//console.log(`page.lineHeight ${page.lineHeight}`);
				//console.log(`page.fontSize ${page.fontSize}`);		
				const iBoxHeigth = iFontSize + 2 * iBorderWidth + iPaddingTop + iPaddingBottom;
				page.moveTo(iMarginLeft + iPaddingLeft, iFontSize + iPaddingBottom);
				page.setFont(timesRomanFont);
				page.setFontSize(iFontSize);
				page.setFontColor(rgb(1, 0, 0));
				if (sLeft !== undefined) {
					page.drawText(`${sLeft}`);
				}
				page.drawText(`page ${idx + 1} / ${pageCnt}`, { x: width - iTextRigthSz - iPaddingRigth });
				page.drawRectangle({
					x: iMarginLeft,
					y: 10,
					width: width - (iMarginLeft + iMarginRight),
					height: iBoxHeigth,
					color: oBackgroundColor,
					opacity: 0.6,
					borderColor: oBorderColor,
					borderWidth: iBorderWidth,
				});
			}
		});
	};
	/**
	 * check if i need to change page
	 * 
	 */
	static changePgIfNeeded(iCurrentHeigth, iBottomPg, iCurLine, oPdf){
		var iCurPage = oPdf.getPageCount();
		var oCurPage = oPdf.getPages()[iCurPage-1];
		var iFontSize = oCurPage.fontSize; // no getter in my version
		var oFont = oCurPage.getFont();
		var iLineHeigth = oCurPage.lineHeight;
		
		// does i need to change page ?
		if (iCurrentHeigth < iBottomPg) {
			iCurLine = 1;
			oCurPage = oPdf.addPage();
			oCurPage.font = oFont;
			oCurPage.setFontSize(iFontSize);
			oCurPage.lineHeight = iLineHeigth;
			//oCurPage.line_space = iLineSpace; // n'existe pas dans ma version
			//iCurrentHeigth = height - line_space * font_size * iCurLine;
			
		}
		return [iCurLine,oCurPage];
	}
	
}

export default PDF;
