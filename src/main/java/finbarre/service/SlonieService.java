package finbarre.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.LongSummaryStatistics;

public class SlonieService {


	public long policz(List<String> in) {

		String[] masyStr = in.get(1).split(" ");
		long[] masy = Arrays.stream(masyStr).mapToLong(Long::parseLong).toArray();

		long[] docelowe = Arrays.stream(in.get(2).split(" ")).mapToLong(Long::parseLong).toArray();
		long[] aktualne = Arrays.stream(in.get(3).split(" ")).mapToLong(Long::parseLong).toArray();
		long wynik = 0;
		List<List<Long>> cykle = new ArrayList<>();
		List<Long> uzyte = new ArrayList<>();
		long sumaMasSloni = 0;
		long najmniejszySlonWCyklu = 1000000000;
		LongSummaryStatistics najmniejszySlonWOgoleStat = Arrays.stream(masy).summaryStatistics();
		long najmniejszySlonWOgole = najmniejszySlonWOgoleStat.getMin();
		long metoda1 = 0;
		long metoda2 = 0;

		for (long i = 0; i < aktualne.length; i++) {
			List<Long> cykl = new ArrayList<>();
			boolean pierwszy = true;
			boolean koniecCyklu = false;
			long szukajWDocelowych = 0;
			if (docelowe[(int) i] != aktualne[(int) i] && !uzyte.contains(aktualne[(int) i])) {
				if (pierwszy) {
					uzyte.add(aktualne[(int) i]);
					cykl.add(aktualne[(int) i]);

					pierwszy = false;
					szukajWDocelowych = docelowe[(int) i];
				}

				while (!koniecCyklu) {
					for (int j = 0; j < aktualne.length; j++) {
						if (szukajWDocelowych == aktualne[j]) {
							cykl.add(aktualne[j]);
							uzyte.add(aktualne[j]);
							szukajWDocelowych = docelowe[j];
							if (szukajWDocelowych == aktualne[(int) i]) {
								koniecCyklu = true;
								cykle.add(cykl);
								cykl = null;
								break;
							}
						}
					}
				}
			}

		}

		for (List<Long> cykl : cykle) {
			sumaMasSloni = 0;
			najmniejszySlonWCyklu = 1000000000;
			for (long i : cykl) {
				sumaMasSloni = sumaMasSloni + masy[(int) (i - 1)];
				if (masy[(int) (i - 1)] < najmniejszySlonWCyklu)
					najmniejszySlonWCyklu = masy[(int) (i - 1)];

			}
			metoda1 = sumaMasSloni + ((cykl.size() - 2) * najmniejszySlonWCyklu);
			metoda2 = sumaMasSloni + najmniejszySlonWCyklu + ((cykl.size() + 1) * najmniejszySlonWOgole);
			wynik = wynik + Math.min(metoda1, metoda2);
		}
		return wynik;
	}
}
