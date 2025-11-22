module job_board::job_board {

    use sui::tx_context::{Self, TxContext};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::event;

    use std::string;
    use std::vector;
    use std::option::{Self, Option};

    //
    // ============================================================
    // STRUCTS
    // ============================================================
    //

    /// Shared global registry for all jobs
    public struct JobBoard has key {
        id: UID,
        jobs: vector<address>,
    }

    /// Job object
    public struct Job has key {
        id: UID,
        employer: address,
        title: string::String,
        company: string::String,
        location: string::String,
        salary: Option<u64>,
        description: string::String,
        status: u8,                   // 0 = Open, 1 = Closed
        hired_candidate: Option<address>,
    }

    /// Capability for employers (to hire / update their job)
    public struct EmployerCap has key, store {
        id: UID,
        job_id: Option<address>,   // employer may or may not have a job
        owner: address,
    }

    /// Application object (candidate’s apply)
    public struct Application has key, store {
        id: UID,
        job_id: address,
        candidate: address,
        cover: string::String,
    }

    //
    // ============================================================
    // EVENTS
    // ============================================================
    //

    public struct JobPosted has copy, drop {
        job_id: address,
        employer: address,
        title: string::String,
    }

    public struct ApplicationSubmitted has copy, drop {
        job_id: address,
        candidate: address,
    }

    public struct CandidateHired has copy, drop {
        job_id: address,
        candidate: address,
    }

    //
    // ============================================================
    // INIT (module initializer)
    // ============================================================
    fun init(ctx: &mut TxContext) {
        let board = JobBoard {
            id: object::new(ctx),
            jobs: vector::empty<address>(),
        };
        transfer::share_object(board);
    }

    //
    // ============================================================
    // ENTRY FUNCTIONS
    // ============================================================
    //

    /// Employer posts a new job
  public entry fun post_job(
    board: &mut JobBoard,
    cap: &mut EmployerCap,
    title: string::String,
    company: string::String,
    location: string::String,
    salary: Option<u64>,
    description: string::String,
    ctx: &mut TxContext
) {
    let sender = tx_context::sender(ctx);

    // Ensure caller owns the cap
    assert!(cap.owner == sender, 100);

    // Create Job object
    let job = Job {
        id: object::new(ctx),
        employer: sender,
        title,
        company,
        location,
        salary,
        description,
        status: 0,
        hired_candidate: option::none<address>(),
    };

    let job_id = object::id_address(&job);

    // Store in global registry
    vector::push_back(&mut board.jobs, job_id);

    // 🔥 Mutate the existing EmployerCap instead of creating a new one
    cap.job_id = option::some<address>(job_id);

    // Emit JobPosted event
    event::emit(JobPosted {
        job_id,
        employer: sender,
        title: job.title,
    });

    // Share the new job
    transfer::share_object(job);
}
    /// Candidate applies to a job
    public entry fun apply_to_job(
        job: &Job,
        cover: string::String,
        ctx: &mut TxContext
    ) {
        assert!(job.status == 0, 0);

        let sender = tx_context::sender(ctx);

        let app = Application {
            id: object::new(ctx),
            job_id: object::id_address(job),
            candidate: sender,
            cover,
        };

        event::emit(ApplicationSubmitted {
            job_id: app.job_id,
            candidate: sender,
        });

        transfer::transfer(app, sender);
    }

    /// Employer hires one candidate (match)
    public entry fun hire_candidate(
        job: &mut Job,
        cap: &EmployerCap,
        application: Application,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);

        // owner check
        assert!(cap.owner == sender, 1);

        // ✅ unwrap Option<address> → address for checks & events
        let cap_job_id_ref = option::borrow(&cap.job_id);   // &address
        let cap_job_id = *cap_job_id_ref;                   // address

        // ensure this cap is for this job
        assert!(cap_job_id == object::id_address(job), 2);
        assert!(job.status == 0, 3);

        job.hired_candidate = option::some<address>(application.candidate);
        job.status = 1;

        event::emit(CandidateHired {
            job_id: cap_job_id,                      // ✅ plain address
            candidate: application.candidate,
        });

        let Application { id, job_id: _, candidate: _, cover: _ } = application;
        object::delete(id);
    }

    /// Allow any user to become an employer by minting an EmployerCap
   public entry fun become_employer(ctx: &mut TxContext) {
    let sender = tx_context::sender(ctx);

    let cap = EmployerCap {
        id: object::new(ctx),
        job_id: option::none<address>(),
        owner: sender,
    };

    transfer::transfer(cap, sender);
}

    //
    // ============================================================
    // READ FUNCTIONS (optional helpers)
    // ============================================================
    // (You may add view / getter functions here as needed)
}