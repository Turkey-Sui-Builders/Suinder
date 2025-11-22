#[test_only]
module job_board::job_board_tests {
    use std::string;
    use std::option;
    use sui::test_scenario::{Self, begin, end, next_tx, ctx, take_shared, return_shared, take_from_sender, return_to_sender, take_from_address};
    
    // Kaynak modülü dahil ediyoruz
    use job_board::job_board::{JobBoard, Job, EmployerCap, Application, init_for_testing, post_job, apply_to_job, hire_candidate, become_employer};

    #[test]
    fun test_full_flow() {
        // Senaryo oyuncuları
        let admin = @0x1;
        let employer = @0xAD;
        let candidate = @0xCA;

        // Testi başlat
        let mut scenario = begin(admin);
        
        // 1. ADIM: JobBoard Başlatma (Init)
        {
            init_for_testing(ctx(&mut scenario));
        };

        // 2. ADIM: İşveren olma (Become Employer)
        next_tx(&mut scenario, employer);
        {
            become_employer(ctx(&mut scenario));
        };

        // 3. ADIM: İlan Çıkma (Post Job)
        next_tx(&mut scenario, employer);
        {
            // Gerekli objeleri al
            let mut board = take_shared<JobBoard>(&scenario);
            let mut cap = take_from_sender<EmployerCap>(&scenario);

            let title = string::utf8(b"Senior Move Dev");
            let company = string::utf8(b"Sui Foundation");
            let location = string::utf8(b"Global Remote");
            let salary = option::some<u64>(150000);
            let desc = string::utf8(b"Build great things");

            // İş ilanını yayınla (Artık cap değişiyor, board değişiyor)
            post_job(&mut board, &mut cap, title, company, location, salary, desc, ctx(&mut scenario));

            // Objeleri geri bırak
            return_shared(board);
            return_to_sender(&scenario, cap);
        };

        // 4. ADIM: Aday Başvurusu (Apply)
        next_tx(&mut scenario, candidate);
        {
            // İlanı sistemden bul
            let job = take_shared<Job>(&scenario);
            let cover_letter = string::utf8(b"I am the best!");

            apply_to_job(&job, cover_letter, ctx(&mut scenario));

            return_shared(job);
        };

        // 5. ADIM: İşe Alım (Hire)
        next_tx(&mut scenario, employer);
        {
            let mut job = take_shared<Job>(&scenario);
            let cap = take_from_sender<EmployerCap>(&scenario);
            
            // Normalde başvuru adayın adresindedir. Test senaryosunda oradan çekiyoruz.
            // Gerçek hayatta aday bu objeyi işverene transfer etmeli veya obje shared olmalıydı.
            // Ancak mantık testi için test_scenario ile adayın kutusundan alıp işliyoruz.
            let app = take_from_address<Application>(&scenario, candidate);

            hire_candidate(&mut job, &cap, app, ctx(&mut scenario));

            return_shared(job);
            return_to_sender(&scenario, cap);
        };

        // Senaryoyu bitir
        end(scenario);
    }
}
